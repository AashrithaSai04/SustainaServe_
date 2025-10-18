import torch
import torch.nn as nn
from torchvision import transforms
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
from io import BytesIO
import pymongo
from datetime import datetime
import os

# -----------------------------
# MongoDB Connection
# -----------------------------
# Connect using your Compass connection string
# Replace with your own connection string if different
mongo_client = pymongo.MongoClient("mongodb://localhost:27017/")
db = mongo_client["food_classification_db"]
collection = db["predictions"]

# -----------------------------
# Model Definition
# -----------------------------
class MultimodalModel(nn.Module):
    def __init__(self):
        super(MultimodalModel, self).__init__()
        self.cnn = nn.Sequential(
            nn.Conv2d(3, 16, 3, stride=1, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(2),
            nn.Conv2d(16, 32, 3, stride=1, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(2),
            nn.Flatten()
        )

        # ✅ 4 metadata features to fix size mismatch
        self.meta_fc = nn.Sequential(
            nn.Linear(4, 32),
            nn.ReLU(),
            nn.Linear(32, 16),
            nn.ReLU()
        )

        self.classifier = nn.Sequential(
            nn.Linear(32 * 56 * 56 + 16, 64),  # flatten size depends on input image
            nn.ReLU(),
            nn.Linear(64, 2),
            nn.Softmax(dim=1)
        )

    def forward(self, image, metadata):
        img_features = self.cnn(image)
        meta_features = self.meta_fc(metadata)
        combined = torch.cat((img_features, meta_features), dim=1)
        out = self.classifier(combined)
        return out


# -----------------------------
# Model Loading
# -----------------------------
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = MultimodalModel().to(device)

try:
    model.load_state_dict(torch.load("fresh_stale_model.pth", map_location=device))
    print("✅ Model loaded successfully!")
except Exception as e:
    print("⚠️ Warning: Could not load model weights ->", e)

model.eval()

# -----------------------------
# FastAPI App Setup
# -----------------------------
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # change this to your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------
# Preprocessing
# -----------------------------
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
])


# -----------------------------
# Routes
# -----------------------------
@app.get("/")
def root():
    return {"message": "Food classification API running"}


@app.post("/predict")
async def predict(
    file: UploadFile = File(...),
    temperature: float = Form(...),
    humidity: float = Form(...),
    light: float = Form(...),
    air_quality: float = Form(...)
):
    try:
        # Read image
        image_bytes = await file.read()
        image = Image.open(BytesIO(image_bytes)).convert("RGB")
        image = transform(image).unsqueeze(0).to(device)

        # Metadata tensor
        metadata = torch.tensor([[temperature, humidity, light, air_quality]], dtype=torch.float32).to(device)

        # Model prediction
        with torch.no_grad():
            output = model(image, metadata)
            _, predicted = torch.max(output, 1)
            label = "fresh" if predicted.item() == 0 else "stale"

        # Store in MongoDB
        data = {
            "filename": file.filename,
            "temperature": temperature,
            "humidity": humidity,
            "light": light,
            "air_quality": air_quality,
            "prediction": label,
            "timestamp": datetime.now().isoformat()
        }
        collection.insert_one(data)

        return {"prediction": label, "stored_in_mongodb": True}

    except Exception as e:
        return {"error": str(e)}


# -----------------------------
# Run Command
# -----------------------------
# Run using: uvicorn app:app --reload

from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import torch
import torch.nn as nn
import torchvision.models as models
import torchvision.transforms as transforms
from PIL import Image
import io

# ----------------------------
# Model Definition (same as training)
# ----------------------------
class MultimodalModel(nn.Module):
    def __init__(self, metadata_dim):
        super().__init__()
        # Pretrained image model
        self.image_model = models.resnet18(pretrained=False)
        num_ftrs = self.image_model.fc.in_features
        self.image_model.fc = nn.Identity()  # remove final layer

        # Metadata model
        self.meta_fc = nn.Sequential(
    nn.Linear(4, 32),  # use 4 instead of 2
    nn.ReLU(),
)


        # Combined classifier
        self.classifier = nn.Sequential(
            nn.Linear(num_ftrs + 32, 128),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(128, 2)
        )

    def forward(self, img, meta):
        img_feat = self.image_model(img)
        meta_feat = self.meta_fc(meta)
        combined = torch.cat([img_feat, meta_feat], dim=1)
        out = self.classifier(combined)
        return out


# ----------------------------
# FastAPI app setup
# ----------------------------
app = FastAPI()

# Allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Device setup
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Load model
model = MultimodalModel(metadata_dim=2)  # assuming 2 metadata values
model.load_state_dict(torch.load("fresh_stale_model.pth", map_location=device))
model.to(device)
model.eval()

# Image preprocessing
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])

# ----------------------------
# Routes
# ----------------------------

@app.get("/")
def root():
    return {"message": "Food classification API running"}

@app.post("/predict")
async def predict(
    file: UploadFile = File(...),
    storage_type: int = Form(...),
    food_type: int = Form(...)
):
    try:
        # Read image
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")
        image = transform(image).unsqueeze(0).to(device)

        # Metadata tensor
        metadata = torch.tensor([[storage_type, food_type]], dtype=torch.float32).to(device)

        # Predict
        with torch.no_grad():
            outputs = model(image, metadata)
            preds = torch.argmax(outputs, dim=1).item()
            label = "fresh" if preds == 0 else "stale"

        return {"prediction": label}

    except Exception as e:
        return {"error": str(e)}

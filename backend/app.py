import os
from datetime import datetime, timedelta
from io import BytesIO

from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
from typing import Optional, List
from passlib.context import CryptContext
from jose import jwt, JWTError
from fastapi.staticfiles import StaticFiles
import uuid

import pymongo
from PIL import Image

import torch
import torch.nn as nn
from torchvision import transforms
from bson.objectid import ObjectId

# -----------------------------
# Config and DB
# -----------------------------
SECRET_KEY = os.environ.get("SECRET_KEY", "replace-this-with-a-secure-random-secret")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

mongo_client = pymongo.MongoClient(os.environ.get("MONGO_URI", "mongodb://localhost:27017/"))
db = mongo_client["food_classification"]
predictions_collection = db["predictions"]
users_collection = db["users"]
food_collection = db["food_listings"]
deliveries_collection = db["deliveries"]


# -----------------------------
# Model (lightweight multimodal stub)
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
            nn.Flatten(),
        )
        self.meta_fc = nn.Sequential(
            nn.Linear(4, 32),
            nn.ReLU(),
            nn.Linear(32, 16),
            nn.ReLU(),
        )
        # classifier size tuned for small example
        self.classifier = nn.Sequential(
            nn.Linear(32 * 56 * 56 + 16, 64),
            nn.ReLU(),
            nn.Linear(64, 2),
            nn.Softmax(dim=1),
        )

    def forward(self, image, metadata):
        img_features = self.cnn(image)
        meta_features = self.meta_fc(metadata)
        combined = torch.cat((img_features, meta_features), dim=1)
        out = self.classifier(combined)
        return out


device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = MultimodalModel().to(device)
try:
    weights_path = os.path.join(os.path.dirname(__file__), "fresh_stale_model.pth")
    if os.path.exists(weights_path):
        model.load_state_dict(torch.load(weights_path, map_location=device))
        print("Model loaded")
    else:
        print("Weights not found at", weights_path)
except Exception as e:
    print("Could not load model weights:", e)
model.eval()

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
])


# -----------------------------
# Auth helpers
# -----------------------------
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


class SignupModel(BaseModel):
    email: str
    password: str
    role: str


class LoginModel(BaseModel):
    email: str
    password: str


# -----------------------------
# Food listing models
# -----------------------------
class FoodListingIn(BaseModel):
    name: str
    provider: str
    quantity: float
    type: str
    storage: str
    preparedTime: datetime
    expiryTime: datetime
    location: str
    notes: Optional[str] = None
    imageUrl: Optional[str] = None
    freshness: Optional[float] = None  # 0-100
    prediction: Optional[str] = None   # "fresh"|"stale"


class FoodListingOut(BaseModel):
    id: str
    name: str
    provider: str
    quantity: float
    type: str
    storage: str
    preparedTime: datetime
    expiryTime: datetime
    location: str
    notes: Optional[str] = None
    imageUrl: Optional[str] = None
    createdAt: datetime
    freshness: Optional[float] = None
    prediction: Optional[str] = None


class ClaimRequest(BaseModel):
    ngoName: Optional[str] = None


class DeliveryOut(BaseModel):
    id: str
    foodId: str
    foodName: str
    provider: str
    pickupLocation: str
    ngoName: str
    status: str
    points: int
    freshness: Optional[float] = None
    expiryTime: datetime
    createdAt: datetime


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def get_user_by_email(email: str):
    return users_collection.find_one({"email": email})


def authenticate_user(email: str, password: str):
    user = get_user_by_email(email)
    if not user:
        return None
    if not verify_password(password, user.get('password')):
        return None
    return user


async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(status_code=401, detail="Could not validate credentials")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = get_user_by_email(email)
    if user is None:
        raise credentials_exception
    return user


def admin_required(user=Depends(get_current_user)):
    if user.get('role') != 'admin':
        raise HTTPException(status_code=403, detail='Admin privileges required')
    return user


# -----------------------------
# FastAPI app and middleware
# -----------------------------
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, set specific origin(s)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static uploads directory for food images
UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")


# Ensure at least one prediction document exists at startup
@app.on_event("startup")
def ensure_prediction_seed():
    try:
        if predictions_collection.count_documents({}) == 0:
            predictions_collection.insert_one({
                "filename": "seed",
                "temperature": 0.0,
                "humidity": 0.0,
                "light": 0.0,
                "air_quality": 0.0,
                "prediction": "fresh",
                "timestamp": datetime.utcnow().isoformat(),
                "source": "startup_seed",
            })
            print("Inserted seed document into food_classification.predictions")
    except Exception as e:
        print("Startup seed failed:", e)


# -----------------------------
# Routes
# -----------------------------
@app.get("/")
def root():
    return {"message": "Food classification API running"}


@app.get("/api/health")
def health():
    return {"status": "ok", "timestamp": datetime.utcnow().isoformat()}


@app.post("/predict")
@app.post("/api/predict")
async def predict(
    file: UploadFile = File(...),
    temperature: float = Form(...),
    humidity: float = Form(...),
    light: float = Form(...),
    air_quality: float = Form(...),
):
    try:
        image_bytes = await file.read()
        image = Image.open(BytesIO(image_bytes)).convert("RGB")
        image = transform(image).unsqueeze(0).to(device)

        metadata = torch.tensor([[temperature, humidity, light, air_quality]], dtype=torch.float32).to(device)

        with torch.no_grad():
            output = model(image, metadata)
            _, predicted = torch.max(output, 1)
            label = "fresh" if predicted.item() == 0 else "stale"

        data = {
            "filename": file.filename,
            "temperature": float(temperature),
            "humidity": float(humidity),
            "light": float(light),
            "air_quality": float(air_quality),
            "prediction": label,
            "timestamp": datetime.utcnow().isoformat(),
        }
        predictions_collection.insert_one(data)

        return {"prediction": label, "stored_in_mongodb": True}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# -----------------------------
# Auth endpoints
# -----------------------------
@app.post('/api/auth/signup')
def signup(data: SignupModel):
    existing = users_collection.find_one({"email": data.email})
    if existing:
        raise HTTPException(status_code=400, detail='User already exists')
    hashed = get_password_hash(data.password)
    user = {"email": data.email, "password": hashed, "role": data.role, "active": True}
    users_collection.insert_one(user)
    return {"msg": "user_created"}


@app.post('/api/auth/login')
def login(data: LoginModel):
    user = authenticate_user(data.email, data.password)
    if not user:
        raise HTTPException(status_code=401, detail='Invalid credentials')
    token = create_access_token({"sub": user.get('email'), "role": user.get('role')})
    return {"token": token, "role": user.get('role')}


# -----------------------------
# Food listing endpoints
# -----------------------------
@app.post('/api/food')
def create_food(item: FoodListingIn):
    doc = item.model_dict() if hasattr(item, 'model_dict') else item.dict()
    # Compute a heuristic freshness if not provided
    if not doc.get("freshness"):
        try:
            prep = doc.get("preparedTime")
            exp = doc.get("expiryTime")
            if isinstance(prep, str):
                prep = datetime.fromisoformat(prep)
            if isinstance(exp, str):
                exp = datetime.fromisoformat(exp)
            total = max((exp - prep).total_seconds(), 1.0)
            left = max((exp - datetime.utcnow()).total_seconds(), 0.0)
            ratio = max(0.0, min(1.0, left / total))
            base = 50 + 50 * ratio
            storage = (doc.get("storage") or "").lower()
            if "refriger" in storage:
                base += 5
            elif "frozen" in storage:
                base += 10
            doc["freshness"] = float(max(0, min(100, base)))
        except Exception:
            doc["freshness"] = 75.0
    if not doc.get("prediction"):
        doc["prediction"] = "fresh" if float(doc.get("freshness", 0)) >= 80 else "stale"
    doc["createdAt"] = datetime.utcnow()
    res = food_collection.insert_one(doc)
    return {"id": str(res.inserted_id)}


@app.get('/api/food', response_model=List[FoodListingOut])
def list_food():
    results: List[FoodListingOut] = []
    for d in food_collection.find().sort("createdAt", -1):
        results.append(FoodListingOut(
            id=str(d.get("_id")),
            name=d.get("name"),
            provider=d.get("provider"),
            quantity=float(d.get("quantity", 0)),
            type=d.get("type"),
            storage=d.get("storage"),
            preparedTime=d.get("preparedTime"),
            expiryTime=d.get("expiryTime"),
            location=d.get("location"),
            notes=d.get("notes"),
            imageUrl=d.get("imageUrl"),
            createdAt=d.get("createdAt") or datetime.utcnow(),
            freshness=float(d.get("freshness")) if d.get("freshness") is not None else None,
            prediction=d.get("prediction"),
        ))
    return results


@app.post('/api/food/{food_id}/claim')
def claim_food(food_id: str, req: ClaimRequest):
    doc = food_collection.find_one({"_id": ObjectId(food_id)})
    if not doc:
        raise HTTPException(status_code=404, detail="Food not found")
    ngo_name = req.ngoName or "NGO"
    # mark listing as claimed
    food_collection.update_one({"_id": ObjectId(food_id)}, {"$set": {"claimed": True, "claimedBy": ngo_name, "claimedAt": datetime.utcnow()}})
    # create delivery task
    points = int(max(10, round(float(doc.get("quantity", 1)) * 5)))
    delivery = {
        "foodId": str(doc.get("_id")),
        "foodName": doc.get("name"),
        "provider": doc.get("provider") or "Provider",
        "pickupLocation": doc.get("location") or "",
        "ngoName": ngo_name,
        "status": "open",
        "points": points,
        "freshness": float(doc.get("freshness")) if doc.get("freshness") is not None else None,
        "expiryTime": doc.get("expiryTime"),
        "createdAt": datetime.utcnow(),
    }
    res = deliveries_collection.insert_one(delivery)
    return {"deliveryId": str(res.inserted_id)}


@app.get('/api/deliveries', response_model=List[DeliveryOut])
def list_deliveries(status: Optional[str] = None):
    query = {}
    if status:
        query["status"] = status
    results: List[DeliveryOut] = []
    for d in deliveries_collection.find(query).sort("createdAt", -1):
        results.append(DeliveryOut(
            id=str(d.get("_id")),
            foodId=d.get("foodId"),
            foodName=d.get("foodName"),
            provider=d.get("provider") or "Provider",
            pickupLocation=d.get("pickupLocation") or "",
            ngoName=d.get("ngoName") or "NGO",
            status=d.get("status") or "open",
            points=int(d.get("points", 10)),
            freshness=float(d.get("freshness")) if d.get("freshness") is not None else None,
            expiryTime=d.get("expiryTime"),
            createdAt=d.get("createdAt") or datetime.utcnow(),
        ))
    return results


@app.post('/api/upload')
async def upload_image(request: Request, file: UploadFile = File(...)):
    try:
        filename = file.filename or "upload.bin"
        ext = os.path.splitext(filename)[1].lower()
        if ext not in [".png", ".jpg", ".jpeg", ".webp", ".gif"]:
            raise HTTPException(status_code=400, detail="Unsupported file type")
        unique_name = f"{uuid.uuid4().hex}{ext}"
        dest = os.path.join(UPLOAD_DIR, unique_name)
        content = await file.read()
        with open(dest, "wb") as f:
            f.write(content)
        base = str(request.base_url).rstrip('/')
        url = f"{base}/uploads/{unique_name}"
        return {"url": url}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# -----------------------------
# Admin user management
# -----------------------------
@app.get('/api/admin/users')
def list_users(admin=Depends(admin_required)):
    users = []
    for u in users_collection.find({}, {"password": 0}):
        u['id'] = str(u.get('_id'))
        u.pop('_id', None)
        users.append(u)
    return users


@app.post('/api/admin/users/{email}/deactivate')
def deactivate_user(email: str, admin=Depends(admin_required)):
    res = users_collection.update_one({"email": email}, {"$set": {"active": False}})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail='User not found')
    return {"msg": "deactivated"}


@app.post('/api/admin/users/{email}/reactivate')
def reactivate_user(email: str, admin=Depends(admin_required)):
    res = users_collection.update_one({"email": email}, {"$set": {"active": True}})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail='User not found')
    return {"msg": "reactivated"}


@app.delete('/api/admin/users/{email}')
def delete_user(email: str, admin=Depends(admin_required)):
    res = users_collection.delete_one({"email": email})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail='User not found')
    return {"msg": "deleted"}

# Note: Run with: uvicorn backend.app:app --reload

# SustainAServe

Dev integration for backend (FastAPI) and frontend (Vite React) is wired. This repo contains:

- backend/: FastAPI app with /api endpoints
- foodflow-care/: Vite + React app with dev proxy to the backend

## Run locally

1) Python backend

- Create/activate a venv (optional)
- Install deps
- Start the API

```cmd
python -m pip install -r backend\requirements.txt
python -m pip install uvicorn
python -m uvicorn backend.app:app --host 127.0.0.1 --port 8000 --reload
```

Your API runs at http://127.0.0.1:8000
- Health check: GET http://127.0.0.1:8000/api/health
- Predict: POST http://127.0.0.1:8000/api/predict (multipart form: file + temperature, humidity, light, air_quality)
- Auth: POST /api/auth/signup, POST /api/auth/login

Optionally set env vars in `backend/.env` (MONGO_URI, SECRET_KEY).

2) Frontend

```cmd
cd foodflow-care
npm install
npm run dev
```

The dev server runs at http://localhost:8080 and proxies /api to http://localhost:8000.

## Notes
- In production, set CORS allow_origins to your site and configure a reverse proxy or set VITE_API_BASE_URL for direct calls.
- Dashboard has a health check and a prediction form to verify end-to-end wiring.

# 🌱 SustainaServe

**SustainaServe** is a food recovery and redistribution platform that helps reduce food waste by connecting food donors, NGOs, and volunteers. The platform enables surplus food to be identified, claimed, and delivered efficiently to communities in need.

## Problem Statement

Millions of kilograms of edible food are wasted every day while many communities continue to face food insecurity. SustainaServe bridges this gap by creating a streamlined ecosystem where surplus food can be donated, claimed, and delivered before it expires.

## Features

### 🍱 Food Donation Management

* Create and manage food donation listings
* Track availability and donation status
* Manage donor information

### 🤝 NGO Coordination

* Browse available food donations
* Claim food listings
* Coordinate collection and distribution

### 🚚 Volunteer Support

* Assist with transportation and delivery
* Track delivery progress
* Improve last-mile food distribution

### 🤖 AI-Powered Freshness Prediction

* Food freshness classification using a PyTorch model
* Supports image-based analysis
* Helps prioritize food distribution based on quality

### 🔐 Authentication & Security

* User authentication
* Secure API access
* Role-based workflows

## Tech Stack

### Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* shadcn/ui

### Backend

* FastAPI
* MongoDB
* PyTorch
* Pillow
* Pydantic

## Project Structure

```text
SustainaServe/
│
├── backend/
│   ├── app.py
│   ├── requirements.txt
│   ├── test_api.py
│   └── ...
│
└── foodflow-care/
    ├── src/
    ├── public/
    ├── package.json
    └── vite.config.ts
```

## Getting Started

### Backend Setup

```bash
cd backend

python -m venv .venv
.venv\Scripts\activate

pip install -r requirements.txt

uvicorn app:app --reload
```

Environment Variables:

```env
MONGO_URI=your_mongodb_connection_string
SECRET_KEY=your_secret_key
```

### Frontend Setup

```bash
cd foodflow-care

npm install

npm run dev
```

## API Capabilities

* User Authentication
* Food Donation Management
* NGO Claim Processing
* Delivery Coordination
* Food Freshness Prediction

## Testing

Run API tests using:

```bash
python test_api.py
```

## Future Enhancements

* Real-time notifications
* Route optimization for deliveries
* Analytics dashboard
* Impact tracking and reporting
* Mobile application support

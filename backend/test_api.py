import requests

url = "http://127.0.0.1:8000/predict"

# Update this path to your local image
image_path = "apple.jpg"

# Send the request as multipart/form-data
with open(image_path, "rb") as f:
    files = {"file": f}
    data = {
        "temperature": 25.3,
        "humidity": 60.2,
        "light": 350.0,
        "air_quality": 42.0
    }

    response = requests.post(url, files=files, data=data)

print(response.json())

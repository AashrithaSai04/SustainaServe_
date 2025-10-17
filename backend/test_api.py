import requests

url = "http://127.0.0.1:8000/predict"
files = {'file': open('apple.jpg', 'rb')}
data = {'storage_type': 0, 'food_type': 0}

response = requests.post(url, files=files, data=data)
print("Response from API:")
print(response.json())

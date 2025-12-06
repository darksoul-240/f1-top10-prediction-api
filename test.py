import requests

url = "https://f1-top10-predictor-api.onrender.com/predict"  
data = {
    "grid": 1,
    "driver_last3_avg": 2.3,
    "constructor_last3_avg": 2.5,
    "driver_win_rate": 0.35,
    "driver_total_races": 150,
    "driver_name": "Verstappen"
}

response = requests.post(url, json=data)
print(response.json())

import requests

url = "https://f1-top10-predictor-api.onrender.com/predict"

# Test data for different drivers
drivers = [
    {
        "grid": 1,
        "driver_last3_avg": 2.3,
        "constructor_last3_avg": 2.5,
        "driver_win_rate": 0.35,
        "driver_total_races": 150,
        "driver_name": "Verstappen"
    },
    {
        "grid": 2,
        "driver_last3_avg": 4.7,
        "constructor_last3_avg": 3.8,
        "driver_win_rate": 0.18,
        "driver_total_races": 125,
        "driver_name": "Norris"
    },
    {
        "grid": 2,
        "driver_last3_avg": 3.0,
        "constructor_last3_avg": 2.8,
        "driver_win_rate": 0.30,
        "driver_total_races": 180,
        "driver_name": "Hamilton"
    },
    {
        "grid": 8,
        "driver_last3_avg": 9.0,
        "constructor_last3_avg": 8.5,
        "driver_win_rate": 0.08,
        "driver_total_races": 80,
        "driver_name": "Gasly"
    },
    {
        "grid": 20,
        "driver_last3_avg": 16.7,
        "constructor_last3_avg": 17.5,
        "driver_win_rate": 0.0,
        "driver_total_races": 20,
        "driver_name": "Sargeant"
    }
]

print("=" * 70)
print("F1 TOP 10 PREDICTIONS")
print("=" * 70)
print(f"{'Driver':<15} {'Grid':<6} {'Predicted':<15} {'Confidence(to be in top10)':<12}")
print("-" * 70)

for driver in drivers:
    response = requests.post(url, json=driver)
    result = response.json()
    
    predicted = "TOP 10" if result['predicted_top10'] else "Outside Top 10"
    confidence = f"{result['confidence']:.1f}%"
    
    print(f"{result['driver']:<15} {driver['grid']:<6} {predicted:<15} {confidence:<12}")

print("=" * 70)


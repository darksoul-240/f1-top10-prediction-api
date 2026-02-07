from fastapi import FastAPI
from fastapi.responses import RedirectResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import joblib
import pandas as pd

app = FastAPI(
    title="F1 Top 10 Predictor",
    description="Predicts if an F1 driver will finish in the top 10 based on qualifying and recent performance metrics.",
    version="1.0.0",
)

# Serve files from the frontend/ directory at the /frontend path
app.mount("/frontend", StaticFiles(directory="frontend"), name="frontend")

# load model (ensure models/f1_top10_model.joblib exists in deployment)
model = joblib.load("models/f1_top10_rfc_model_v2.joblib")


class RaceInput(BaseModel):
    grid: int
    driver_last3_avg: float
    constructor_last3_avg: float
    driver_win_rate: float
    driver_total_races: int
    driver_name: str = "Unknown"


@app.get("/")
def home():
    return RedirectResponse(url="/frontend/index.html")


@app.get("/health")
def health():
    return {"status": "healthy"}


@app.post("/predict")
def predict(data: RaceInput):
    try:
        features = [
            "grid",
            "driver_last3_avg",
            "constructor_last3_avg",
            "driver_win_rate",
            "driver_total_races",
        ]

        input_df = pd.DataFrame(
            [
                [
                    data.grid,
                    data.driver_last3_avg,
                    data.constructor_last3_avg,
                    data.driver_win_rate,
                    data.driver_total_races,
                ]
            ],
            columns=features,
        )

        print(f"Input data: {input_df}")  # Debug

        prediction = model.predict(input_df)[0]
        probability = model.predict_proba(input_df)[0]

        return {
            "driver": data.driver_name,
            "predicted_top10": bool(prediction),
            "confidence": float(probability[1]) * 100,
        }
    except Exception as e:
        print(f"ERROR: {e}")  # Debug
        raise
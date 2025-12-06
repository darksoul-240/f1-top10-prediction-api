# F1 Top 10 Predictor 🏎️

Machine Learning API that predicts if an F1 driver will finish in the top 10 based on qualifying position and recent performance.

## Features
- 78.5% accuracy on data (2020-2024)
- Random Forest classifier with GridSearchCV tuning
- FastAPI REST API
- Real-time predictions

## API Endpoints
- `GET /` - Home
- `GET /health` - Health check
- `POST /predict` - Make prediction

## Tech Stack
- Python 3.14
- scikit-learn 1.7.2
- FastAPI + Uvicorn
- Kaggle for training
  
## URL for API
- https://f1-top10-predictor-api.onrender.com

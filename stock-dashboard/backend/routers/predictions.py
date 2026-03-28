from fastapi import APIRouter, HTTPException
from backend.services.ml_predictor import get_prediction
from backend.models.schemas import PredictionResponse

router = APIRouter(prefix="/api/predict", tags=["predictions"])

@router.get("/{symbol}", response_model=PredictionResponse)
async def predict_stock(symbol: str):
    try:
        prediction = await get_prediction(symbol)
        return prediction
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

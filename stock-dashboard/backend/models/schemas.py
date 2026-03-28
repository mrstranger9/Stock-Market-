from pydantic import BaseModel
from typing import List, Optional, Literal

class StockData(BaseModel):
    symbol: str
    currentPrice: Optional[float]
    previousClose: Optional[float]
    open: Optional[float]
    dayHigh: Optional[float]
    dayLow: Optional[float]
    volume: Optional[int]
    marketCap: Optional[float]
    fiftyTwoWeekHigh: Optional[float]
    fiftyTwoWeekLow: Optional[float]
    priceToEarningsRatio: Optional[float]
    dividendYield: Optional[float]
    percentChange: Optional[float]

class HistoryPoint(BaseModel):
    date: str
    open: float
    high: float
    low: float
    close: float
    volume: int

class PredictionResponse(BaseModel):
    symbol: str
    current_price: float
    predicted_price: float
    prediction_date: str
    confidence_score: float
    trend: Literal["BUY", "SELL", "HOLD"]
    support_level: Optional[float]
    resistance_level: Optional[float]

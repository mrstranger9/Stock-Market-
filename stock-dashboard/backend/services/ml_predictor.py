import yfinance as yf
import pandas as pd
import numpy as np
import datetime
import asyncio
import time
from sklearn.ensemble import RandomForestRegressor
from backend.utils.indicators import compute_indicators
from backend.models.schemas import PredictionResponse

_prediction_cache = {}
PRED_CACHE_TTL = 3600

def train_and_predict_sync(symbol: str) -> PredictionResponse:
    ticker = yf.Ticker(symbol)
    df = ticker.history(period="2y")
    if df.empty or len(df) < 200:
        raise ValueError(f"Not enough data for {symbol}")
        
    df = compute_indicators(df)
    df = df.dropna()
    
    df['Target'] = df['Close'].shift(-1)
    
    features = ['Open', 'High', 'Low', 'Close', 'Volume', 'SMA_20', 'SMA_50', 'SMA_200', 
                'RSI', 'MACD', 'MACD_Signal', 'BB_High', 'BB_Low', 'BB_Mid']
                
    train_df = df.dropna(subset=['Target'])
    
    X = train_df[features]
    y = train_df['Target']
    
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X, y)
    
    last_row = df.iloc[-1:]
    X_pred = last_row[features]
    predicted_price = model.predict(X_pred)[0]
    
    current_price = last_row['Close'].values[0]
    
    last_30 = df.iloc[-30:]
    support = last_30['Low'].min()
    resistance = last_30['High'].max()
    
    pct_change = (predicted_price - current_price) / current_price
    
    if pct_change > 0.01:
        trend = "BUY"
    elif pct_change < -0.01:
        trend = "SELL"
    else:
        trend = "HOLD"
        
    preds = np.array([tree.predict(X_pred)[0] for tree in model.estimators_])
    std_dev = np.std(preds)
    mean_pred = np.mean(preds)
    cv = std_dev / mean_pred if mean_pred > 0 else 0
    confidence = max(50.0, min(99.0, 100 - (cv * 1000))) 
    
    return PredictionResponse(
        symbol=symbol,
        current_price=float(current_price),
        predicted_price=float(predicted_price),
        prediction_date=(datetime.datetime.now() + datetime.timedelta(days=1)).strftime("%Y-%m-%d"),
        confidence_score=float(round(confidence, 2)),
        trend=trend,
        support_level=float(support),
        resistance_level=float(resistance)
    )

async def get_prediction(symbol: str) -> PredictionResponse:
    now = time.time()
    if symbol in _prediction_cache:
        data, timestamp = _prediction_cache[symbol]
        if now - timestamp < PRED_CACHE_TTL:
            return data
            
    loop = asyncio.get_event_loop()
    data = await loop.run_in_executor(None, train_and_predict_sync, symbol)
    _prediction_cache[symbol] = (data, now)
    return data

import yfinance as yf
import pandas as pd
import asyncio
import time
from typing import Dict, List, Optional
from backend.models.schemas import StockData

_cache = {}
CACHE_TTL = 30 # seconds

STOCKS = [
    "RELIANCE.NS", "HDFCBANK.NS", "TCS.NS", "INFY.NS",
    "ICICIBANK.NS", "SBIN.NS", "BHARTIARTL.NS",
    "BAJFINANCE.NS", "HINDUNILVR.NS", "LT.NS"
]

def fetch_quote_sync(symbol: str) -> Optional[StockData]:
    try:
        ticker = yf.Ticker(symbol)
        info = ticker.history(period="1d")
        if info.empty:
            return None
            
        last_quote = info.iloc[-1]
        t_info = ticker.info
        
        current_price = float(t_info.get('currentPrice', last_quote['Close']))
        prev_close_val = t_info.get('previousClose', t_info.get('regularMarketPreviousClose', current_price))
        prev_close = float(prev_close_val) if prev_close_val else current_price
        
        open_price = float(t_info.get('open', last_quote['Open']))
        day_high = float(t_info.get('dayHigh', last_quote['High']))
        day_low = float(t_info.get('dayLow', last_quote['Low']))
        volume = t_info.get('volume', last_quote.get('Volume', 0))
        
        percent_change = ((current_price - prev_close) / prev_close) * 100 if prev_close else 0.0

        return StockData(
            symbol=symbol,
            currentPrice=current_price,
            previousClose=prev_close,
            open=open_price,
            dayHigh=day_high,
            dayLow=day_low,
            volume=int(volume) if pd.notna(volume) else 0,
            marketCap=float(t_info.get('marketCap', 0.0)) if t_info.get('marketCap') else None,
            fiftyTwoWeekHigh=float(t_info.get('fiftyTwoWeekHigh', 0.0)) if t_info.get('fiftyTwoWeekHigh') else None,
            fiftyTwoWeekLow=float(t_info.get('fiftyTwoWeekLow', 0.0)) if t_info.get('fiftyTwoWeekLow') else None,
            priceToEarningsRatio=float(t_info.get('trailingPE', 0.0)) if t_info.get('trailingPE') else None,
            dividendYield=float(t_info.get('dividendYield', 0.0)) if t_info.get('dividendYield') else None,
            percentChange=float(percent_change)
        )
    except Exception as e:
        print(f"Error fetching {symbol}: {e}")
        return None

async def get_stock_quote(symbol: str) -> Optional[StockData]:
    now = time.time()
    if symbol in _cache:
        data, timestamp = _cache[symbol]
        if now - timestamp < CACHE_TTL:
            return data
            
    for attempt in range(3):
        try:
            loop = asyncio.get_event_loop()
            data = await loop.run_in_executor(None, fetch_quote_sync, symbol)
            if data:
                _cache[symbol] = (data, now)
                return data
        except Exception as e:
            await asyncio.sleep(2 ** attempt)
    return None

async def get_multiple_quotes(symbols: List[str]) -> List[StockData]:
    tasks = [get_stock_quote(sym) for sym in symbols]
    results = await asyncio.gather(*tasks)
    return [r for r in results if r is not None]

async def prewarm_cache():
    print("Pre-warming cache for all stocks...")
    await get_multiple_quotes(STOCKS)
    print("Cache pre-warmed.")

async def get_stock_history(symbol: str, period: str = "1mo") -> dict:
    valid_periods = {"1d": "1d", "1w": "5d", "1mo": "1mo", "3mo": "3mo"}
    p = valid_periods.get(period, "1mo")
    
    loop = asyncio.get_event_loop()
    def fetch_hist():
        ticker = yf.Ticker(symbol)
        if period == "1d":
            # 5 minute intervals for 1d for nice chart
            return ticker.history(period="1d", interval="5m")
        return ticker.history(period=p)
        
    df = await loop.run_in_executor(None, fetch_hist)
    history = []
    
    # Handle timezone issues, ignore tz
    if not df.empty:
        df.index = df.index.tz_localize(None)

    for date, row in df.iterrows():
        history.append({
            "date": date.strftime("%Y-%m-%d %H:%M:%S") if period == "1d" else date.strftime("%Y-%m-%d"),
            "open": float(row["Open"]),
            "high": float(row["High"]),
            "low": float(row["Low"]),
            "close": float(row["Close"]),
            "volume": int(row["Volume"]) if pd.notna(row["Volume"]) else 0
        })
    return {"symbol": symbol, "history": history}

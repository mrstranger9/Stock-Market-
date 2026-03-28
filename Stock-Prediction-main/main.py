"""
Real-time Indian Stock Data Backend
FastAPI + yfinance → serves 10 NSE stocks with SSE for live updates
Run: uvicorn main:app --reload --port 8000

NSE tickers use the ".NS" suffix on Yahoo Finance:
  RELIANCE.NS, HDFCBANK.NS, TCS.NS, INFY.NS, ICICIBANK.NS,
  SBIN.NS, BHARTIARTL.NS, BAJFINANCE.NS, HINDUNILVR.NS, LT.NS
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import yfinance as yf
import pandas as pd
import asyncio
import json
import time

app = FastAPI(title="Indian Stock Prediction API")

# ── CORS: allow Next.js dev server (port 9002) ──────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:9002", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Top 10 Indian NSE stocks (Yahoo Finance .NS suffix) ─────────────────────
SYMBOLS = [
    "RELIANCE.NS",   # Reliance Industries
    "HDFCBANK.NS",   # HDFC Bank
    "TCS.NS",        # Tata Consultancy Services
    "INFY.NS",       # Infosys
    "ICICIBANK.NS",  # ICICI Bank
    "SBIN.NS",       # State Bank of India
    "BHARTIARTL.NS", # Bharti Airtel
    "BAJFINANCE.NS", # Bajaj Finance
    "HINDUNILVR.NS", # Hindustan Unilever
    "LT.NS",         # Larsen & Toubro
]


def fetch_stock_data(symbol: str) -> dict:
    """Fetch current quote + 7-day sparkline for a single ticker."""
    ticker = yf.Ticker(symbol)
    info = ticker.fast_info          # lightweight; no full info() call

    # 7-day 1h history for sparkline
    hist = ticker.history(period="7d", interval="1h")
    sparkline = [{"value": round(float(v), 2)} for v in hist["Close"].dropna().tolist()]

    price = round(float(info.last_price or 0), 2)
    prev_close = round(float(info.previous_close or price), 2)
    change = round(price - prev_close, 2)
    change_pct = round((change / prev_close * 100) if prev_close else 0, 2)

    market_cap = info.market_cap or 0
    def fmt_cap(v: float) -> str:
        if v >= 1e12: return f"{v/1e12:.2f}T"
        if v >= 1e9:  return f"{v/1e9:.2f}B"
        if v >= 1e6:  return f"{v/1e6:.2f}M"
        return str(int(v))

    volume = info.three_month_average_volume or 0
    def fmt_vol(v: float) -> str:
        if v >= 1e6: return f"{v/1e6:.1f}M"
        if v >= 1e3: return f"{v/1e3:.1f}K"
        return str(int(v))

    return {
        "symbol": symbol,
        "name": ticker.info.get("longName", symbol),
        "price": price,
        "change": change,
        "changePercent": change_pct,
        "volume": fmt_vol(volume),
        "marketCap": fmt_cap(market_cap),
        "sparklineData": sparkline[-20:],   # last 20 points for the chart
        "timestamp": int(time.time()),
    }


def fetch_all() -> list[dict]:
    """Fetch all 10 stocks. Returns list even if some fail."""
    results = []
    for sym in SYMBOLS:
        try:
            results.append(fetch_stock_data(sym))
        except Exception as e:
            print(f"[WARN] {sym}: {e}")
    return results


# ── REST endpoints ───────────────────────────────────────────────────────────

@app.get("/api/stocks")
def get_stocks():
    """Snapshot of all 10 stocks — call once on page load."""
    return fetch_all()


@app.get("/api/stocks/{symbol:path}")
def get_stock(symbol: str):
    """
    Single-stock snapshot.
    Use the full Yahoo Finance ticker, e.g. /api/stocks/RELIANCE.NS
    The :path converter allows dots in the URL segment.
    """
    symbol = symbol.upper()
    if symbol not in SYMBOLS:
        return {"error": f"{symbol} not in watchlist. Valid symbols: {SYMBOLS}"}
    return fetch_stock_data(symbol)


@app.get("/api/backtest/history")
def get_backtest_history(symbol: str, start: str, end: str):
    """
    Fetch historical data for backtesting.
    Example: /api/backtest/history?symbol=AAPL&start=2024-01-01&end=2024-12-31
    """
    try:
        symbol = symbol.upper()
        # Clean symbol for NSE if needed (frontend might send RELIANCE instead of RELIANCE.NS)
        if not symbol.endswith(".NS") and symbol in [s.replace(".NS", "") for s in SYMBOLS]:
            symbol = f"{symbol}.NS"
            
        df = yf.download(symbol, start=start, end=end, interval="1d")
        
        if df.empty:
            return {"error": f"No data found for {symbol} between {start} and {end}"}
            
        # Reset index to get Date as a column
        df = df.reset_index()
        
        # Flatten MultiIndex columns if present
        if isinstance(df.columns, pd.MultiIndex):
            df.columns = [col[0] if col[1] == "" else col[0] for col in df.columns]

        history = []
        for _, row in df.iterrows():
            # Ensure row["Date"] is a timestamp
            date_val = row["Date"]
            if isinstance(date_val, pd.Series):
                date_val = date_val.iloc[0]
            
            date_str = date_val.strftime("%Y-%m-%d")

            def get_val(col):
                val = row[col]
                if isinstance(val, (pd.Series, dict, list, tuple)): return float(val.iloc[0] if isinstance(val, pd.Series) else val[0])
                return float(val)

            history.append({
                "time": date_str,
                "open": round(get_val("Open"), 2),
                "high": round(get_val("High"), 2),
                "low": round(get_val("Low"), 2),
                "close": round(get_val("Close"), 2),
                "volume": int(get_val("Volume"))
            })
            
        return history
    except Exception as e:
        print(f"[ERROR] Backtest history fetch failed: {e}")
        return {"error": str(e)}


# ── Server-Sent Events  ──────────────────────────────────────────────────────

async def stock_event_generator():
    """Yields SSE data every 15 seconds forever."""
    while True:
        data = fetch_all()
        yield f"data: {json.dumps(data)}\n\n"
        await asyncio.sleep(15)   # Yahoo Finance free tier: be polite


@app.get("/api/stocks/live/stream")
async def live_stream():
    """
    SSE endpoint.  Frontend connects once and receives push updates.
    EventSource URL: http://localhost:8000/api/stocks/live/stream
    """
    return StreamingResponse(
        stock_event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        },
    )
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import asyncio

from backend.routers import stocks, predictions
from backend.services.yahoo_finance import prewarm_cache

app = FastAPI(title="Indian Stock Market Dashboard API")

app.add_middleware(
    CORSMiddleware,
    # Allow local frontend ports
    allow_origins=["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:5173", "http://127.0.0.1:3000"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(stocks.router)
app.include_router(stocks.ws_router)
app.include_router(predictions.router)

@app.on_event("startup")
async def startup_event():
    # Pre-warm the cache in the background
    asyncio.create_task(prewarm_cache())
    # Start the broadcast task
    asyncio.create_task(stocks.broadcast_stock_updates())

@app.get("/health")
async def health_check():
    return {"status": "ok"}

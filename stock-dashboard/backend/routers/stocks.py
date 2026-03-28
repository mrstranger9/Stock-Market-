from fastapi import APIRouter, HTTPException, WebSocket, WebSocketDisconnect
from typing import List, Dict
import asyncio
from backend.services.yahoo_finance import get_multiple_quotes, STOCKS, get_stock_quote, get_stock_history
from backend.models.schemas import StockData

router = APIRouter(prefix="/api/stocks", tags=["stocks"])

# Active websocket connections
active_connections: set[WebSocket] = set()

async def broadcast_stock_updates():
    """Background task to push live updates every 30 seconds to connected clients."""
    while True:
        if active_connections:
            try:
                data = await get_multiple_quotes(STOCKS)
                data_dicts = [d.model_dump() for d in data]
                
                disconnected = set()
                for connection in active_connections:
                    try:
                        await connection.send_json({"type": "update", "data": data_dicts})
                    except Exception:
                        disconnected.add(connection)
                
                active_connections.difference_update(disconnected)
            except Exception as e:
                print(f"Error broadcasting: {e}")
        # Wait 30 seconds before next broadcast
        await asyncio.sleep(30)

@router.get("", response_model=List[StockData])
async def get_all_stocks():
    data = await get_multiple_quotes(STOCKS)
    return data

@router.get("/{symbol}", response_model=StockData)
async def get_stock(symbol: str):
    data = await get_stock_quote(symbol)
    if not data:
        raise HTTPException(status_code=404, detail="Stock not found")
    return data

@router.get("/{symbol}/history")
async def get_history(symbol: str, period: str = "1mo"):
    data = await get_stock_history(symbol, period)
    if not data or not data.get("history"):
        raise HTTPException(status_code=404, detail="History not found")
    return data
    
ws_router = APIRouter(tags=["websocket"])

@ws_router.websocket("/ws/stocks")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    active_connections.add(websocket)
    try:
        # Send initial data immediately
        data = await get_multiple_quotes(STOCKS)
        await websocket.send_json({"type": "init", "data": [d.model_dump() for d in data]})
        
        while True:
            # Client doesn't need to send anything, 
            # but we await receive to keep connection open and detect disconnects
            await websocket.receive_text()
    except WebSocketDisconnect:
        active_connections.remove(websocket)

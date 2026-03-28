# QuantAxis Pro - Advanced Trading & Backtesting Terminal

A high-performance trading dashboard and strategy backtesting environment built with Next.js and FastAPI.

## 🚀 Overview
QuantAxis Pro provides institutional-grade trading tools, real-time market data visualization, and a powerful backtesting engine to simulate and refine technical trading strategies.

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 15+ (App Router)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **UI Components**: Shadcn/UI (Radix UI)
- **Charts**: Custom Recharts & Strategy Visualization Components

### Backend
- **Framework**: FastAPI (Python)
- **Data Source**: Yahoo Finance (`yfinance`)
- **Data Analysis**: Pandas, NumPy
- **Server**: Uvicorn

## 📈 Key Features

### 1. Real-time Backtesting Engine
The core of the application is a dynamic backtesting suite that allows users to test technical strategies against historical data.
- **Data Flow**: `yfinance` → `FastAPI` → `Next.js`
- **Simulation**: Processes historical records day-by-day to simulate high-fidelity "live" trading.
- **Equity Curve**: Visualizes portfolio growth and drawdown in real-time.
- **Trade History**: Logs all entries and exits with P&L calculation.

### 2. Strategy Implementation (EMA Crossover)
The current implementation features a robust **Exponential Moving Average (EMA) Crossover** strategy:
- **Fast EMA (9-period)**: Captures short-term momentum.
- **Slow EMA (21-period)**: Identifies long-term trend.
- **Logic**: 
  - **BUY**: When 9-EMA crosses above 21-EMA (Bullish Crossover).
  - **SELL**: When 9-EMA crosses below 21-EMA (Bearish Crossover).

### 3. Market Data & News
- Real-time stock price tracking for major indices (NIFTY 50, SENSEX).
- Live news feed integration.
- Interactive candlestick charts with indicator overlays.

## 📁 Project Structure

```text
/
├── Stock-Prediction-main/   # Main Next.js Source Code
│   ├── src/app/             # Application Routes & Pages
│   │   └── backtesting/     # Backtesting Component & Page
│   ├── main.py              # FastAPI Backend Entry Point
│   └── next.config.ts       # Next.js Configuration (Static Export)
├── out/                     # Static Export Build Output
├── backtesting/             # Deployed Backtesting Page (Static)
├── dashboard/               # Deployed Dashboard Page (Static)
└── venv/                    # Python Virtual Environment
```

## ⚙️ Setup & Installation

### 1. Backend Setup
```bash
cd Stock-Prediction-main
# Ensure venv is activated
../venv/Scripts/activate
# Run the backend server
uvicorn main:app --port 8000
```

### 2. Frontend Development
```bash
cd Stock-Prediction-main
npm install
npm run dev
```

### 3. Production Build (Static Site)
```bash
cd Stock-Prediction-main
npm run build
# Files will be exported to ../out/
```

## 🔍 How Every Function Works

### `main.py` (FastAPI)
- **`/api/backtest/history`**: Fetches historical OHLCV data for a given symbol and date range using `yfinance`. It cleans the data, flattens MultiIndex columns, and formats timestamps for the frontend.

### `backtesting-client.tsx` (Next.js)
- **`runBacktestSimulation`**: The main loop that iterates through historical data, calculates indicators, generates signals, and updates the application state to provide real-time visual feedback.
- **`calculateEMA`**: A utility function implementing the EMA formula for technical analysis.
- **`onSubmit`**: Handles the form submission, fetches data from the backend, and initializes the simulation.

## 📡 Data Fetching
Market data is retrieved using the `yfinance` library in Python. This data is then serialized into JSON and sent to the frontend React components via the FastAPI REST endpoint.

---
*Built for Traders, by Developers.*

import pandas as pd
import ta
import warnings

def compute_indicators(df: pd.DataFrame) -> pd.DataFrame:
    """
    Given a positive history DataFrame, computes standard tech indicators.
    """
    if len(df) < 200:
        return df
        
    df = df.copy()
    warnings.filterwarnings('ignore')
    
    # SMA 20, 50, 200
    df['SMA_20'] = ta.trend.sma_indicator(df['Close'], window=20)
    df['SMA_50'] = ta.trend.sma_indicator(df['Close'], window=50)
    df['SMA_200'] = ta.trend.sma_indicator(df['Close'], window=200)

    # RSI
    df['RSI'] = ta.momentum.rsi(df['Close'], window=14)

    # MACD
    macd = ta.trend.MACD(df['Close'])
    df['MACD'] = macd.macd()
    df['MACD_Signal'] = macd.macd_signal()
    df['MACD_Hist'] = macd.macd_diff()

    # Bollinger Bands
    indicator_bb = ta.volatility.BollingerBands(close=df["Close"], window=20, window_dev=2)
    df['BB_High'] = indicator_bb.bollinger_hband()
    df['BB_Low'] = indicator_bb.bollinger_lband()
    df['BB_Mid'] = indicator_bb.bollinger_mavg()

    return df

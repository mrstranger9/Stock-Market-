import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchStock, fetchStockHistory, fetchPrediction } from '../services/api';
import StockChart from '../components/StockChart';
import { ArrowLeft, TrendingUp, TrendingDown, Activity, RefreshCw } from 'lucide-react';

export default function StockDetail() {
  const { symbol } = useParams();
  const [period, setPeriod] = useState('1mo');

  const { data: stock, isLoading: loadingStock } = useQuery({
    queryKey: ['stock', symbol],
    queryFn: () => fetchStock(symbol),
    refetchInterval: 30000,
  });

  const { data: historyData, isLoading: loadingHistory } = useQuery({
    queryKey: ['history', symbol, period],
    queryFn: () => fetchStockHistory(symbol, period),
  });

  const { data: prediction, isLoading: loadingPrediction } = useQuery({
    queryKey: ['prediction', symbol],
    queryFn: () => fetchPrediction(symbol),
  });

  if (loadingStock) {
    return <div className="animate-pulse space-y-6">
      <div className="h-10 w-24 bg-darkCard rounded lg"></div>
      <div className="h-32 w-full bg-darkCard rounded-2xl"></div>
      <div className="h-[450px] w-full bg-darkCard rounded-2xl"></div>
    </div>;
  }

  if (!stock) {
    return <div className="text-center mt-10 text-brandRed">Stock Not Found</div>;
  }

  const isPositive = stock.percentChange >= 0;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Link to="/" className="inline-flex items-center text-gray-400 hover:text-white mb-6 transition-colors font-medium">
        <ArrowLeft size={18} className="mr-2" /> Back to Dashboard
      </Link>

      {/* Header Card */}
      <div className="bg-darkCard/80 backdrop-blur-sm rounded-3xl p-6 md:p-8 mb-8 border border-darkBorder flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-2xl relative overflow-hidden">
        
        {/* Decorative background element */}
        <div className={`absolute -right-20 -top-20 w-64 h-64 rounded-full blur-3xl opacity-10 pointer-events-none ${isPositive ? 'bg-brandGreen' : 'bg-brandRed'}`}></div>

        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-2 tracking-tight flex items-center gap-3">
            {stock.symbol.replace('.NS', '')} 
            <span className="text-sm font-semibold bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full border border-blue-500/30">NSE</span>
          </h1>
          <p className="text-gray-400 font-medium">Indian Stock Market</p>
        </div>

        <div className="text-left md:text-right">
          <div className="text-5xl md:text-6xl font-black mb-2 tracking-tighter">
            ₹{stock.currentPrice?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className={`flex items-center md:justify-end text-xl font-bold ${isPositive ? 'text-brandGreen' : 'text-brandRed'}`}>
            {isPositive ? <TrendingUp size={24} className="mr-2" strokeWidth={3} /> : <TrendingDown size={24} className="mr-2" strokeWidth={3} />}
            {isPositive ? '+' : ''}{stock.percentChange?.toFixed(2)}%
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Chart Column */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-darkCard/50 backdrop-blur-sm rounded-3xl p-6 border border-darkBorder shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold flex items-center">
                <Activity className="mr-3 text-blue-500" /> Price Chart
              </h2>
              <div className="flex bg-darkBg rounded-lg p-1 border border-darkBorder">
                {['1d', '1w', '1mo', '3mo'].map((p) => (
                  <button
                    key={p}
                    onClick={() => setPeriod(p)}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${period === p ? 'bg-blue-600 shadow-md text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                  >
                    {p.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
            
            {loadingHistory ? (
              <div className="h-[450px] flex items-center justify-center border border-darkBorder border-dashed rounded-2xl bg-darkCard/20">
                <RefreshCw className="animate-spin text-blue-500 mb-2" size={32} />
              </div>
            ) : (
              <StockChart data={historyData?.history} period={period} />
            )}
          </div>
          
          {/* Key Statistics */}
          <div className="bg-darkCard/50 rounded-3xl p-6 border border-darkBorder shadow-xl">
            <h3 className="text-xl font-bold mb-6 border-b border-darkBorder pb-4">Key Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: 'Market Cap', value: stock.marketCap ? `₹${(stock.marketCap / 10000000).toLocaleString('en-IN', { maximumFractionDigits: 2 })}Cr` : '---' },
                { label: 'P/E Ratio', value: stock.priceToEarningsRatio?.toFixed(2) || '---' },
                { label: 'Dividend Yield', value: stock.dividendYield ? `${(stock.dividendYield * 100).toFixed(2)}%` : '---' },
                { label: 'Volume', value: stock.volume ? (stock.volume / 100000).toFixed(1) + 'L' : '---' },
                { label: 'Open', value: `₹${stock.open?.toFixed(2)}` },
                { label: 'Prev Close', value: `₹${stock.previousClose?.toFixed(2)}` },
                { label: '52W High', value: `₹${stock.fiftyTwoWeekHigh?.toFixed(2)}` },
                { label: '52W Low', value: `₹${stock.fiftyTwoWeekLow?.toFixed(2)}` },
              ].map((stat, i) => (
                <div key={i} className="flex flex-col p-4 bg-darkBg/50 rounded-2xl border border-darkBorder/50">
                  <span className="text-gray-400 text-sm mb-1 font-medium">{stat.label}</span>
                  <span className="font-bold text-lg">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar - ML Prediction */}
        <div className="space-y-8">
          <div className="bg-gradient-to-br from-indigo-900/40 to-darkCard rounded-3xl p-1 border border-indigo-500/30 shadow-[0_0_30px_rgba(79,70,229,0.1)]">
            <div className="bg-darkCard/90 backdrop-blur-md rounded-[23px] p-6 h-full">
              <h3 className="text-xl font-bold mb-6 flex items-center border-b border-darkBorder pb-4">
                <span className="bg-indigo-500/20 p-2 rounded-lg mr-3 border border-indigo-500/30 text-indigo-400">🤖</span>
                ML AI Forecast
              </h3>

              {loadingPrediction ? (
                 <div className="py-12 flex flex-col items-center justify-center">
                    <RefreshCw className="animate-spin text-indigo-500 mb-4" size={32} />
                    <p className="text-indigo-300/70 animate-pulse text-sm font-medium">Running models...</p>
                 </div>
              ) : prediction ? (
                <div className="space-y-6">
                  <div className={`text-center p-4 py-6 rounded-2xl border ${
                    prediction.trend === 'BUY' ? 'bg-brandGreen/10 border-brandGreen/30 text-brandGreen shadow-[0_0_20px_rgba(16,185,129,0.1)]' : 
                    prediction.trend === 'SELL' ? 'bg-brandRed/10 border-brandRed/30 text-brandRed shadow-[0_0_20px_rgba(239,68,68,0.1)]' : 
                    'bg-yellow-500/10 border-yellow-500/30 text-yellow-500'
                  }`}>
                    <div className="text-4xl font-black tracking-widest mb-1">{prediction.trend}</div>
                    <div className="text-sm opacity-80 font-medium">AI Recommended Action</div>
                  </div>

                  <div className="bg-darkBg/60 p-5 rounded-2xl border border-darkBorder">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-gray-400 text-sm font-medium">Target Price (1D)</span>
                      <span className="font-bold text-xl text-white">₹{prediction.predicted_price.toFixed(2)}</span>
                    </div>
                    
                    <div className="w-full bg-darkCard rounded-full h-2 mb-2 border border-darkBorder overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-1000 ease-out" 
                        style={{ width: `${prediction.confidence_score}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-gray-500">Confidence</span>
                      <span className="text-indigo-400">{prediction.confidence_score.toFixed(1)}%</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-darkBg/60 p-4 rounded-2xl border border-darkBorder text-center">
                      <span className="text-gray-400 text-xs uppercase tracking-widest font-bold block mb-1 text-brandGreen">Resist</span>
                      <span className="font-bold text-lg text-white">₹{prediction.resistance_level?.toFixed(2)}</span>
                    </div>
                    <div className="bg-darkBg/60 p-4 rounded-2xl border border-darkBorder text-center">
                      <span className="text-gray-400 text-xs uppercase tracking-widest font-bold block mb-1 text-brandRed">Support</span>
                      <span className="font-bold text-lg text-white">₹{prediction.support_level?.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <p className="text-xs text-gray-500 text-center mt-4">Predictions generated via Random Forest regressions using TA features (RSI, MACD, BB).</p>
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">Prediction unavailable</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

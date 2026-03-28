"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Download, Maximize2, Activity } from "lucide-react";
import { MarketData } from "@/lib/market-simulator";
import { useState, useMemo } from "react";
import { PriceTag } from "../ui/price-tag";
import { ChangeBadge } from "../ui/change-badge";
import { SignalBadge } from "../ui/signal-badge";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Filler,
} from 'chart.js';
import { Chart } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Filler);

interface ModalProps {
  stock: MarketData | null;
  isOpen: boolean;
  onClose: () => void;
}

export function StockDetailModal({ stock, isOpen, onClose }: ModalProps) {
  const [activeTab, setActiveTab] = useState("Overview");

  const chartData = useMemo(() => {
    if (!stock) return null;
    const labels = Array.from({ length: 40 }).map((_, i) => `${i + 1} Apr`);
    
    // Generate OHLC-like area chart + vol
    let val = stock.price * 0.9;
    const prices = Array.from({ length: 40 }).map(() => {
      val = val * (1 + (Math.random() * 0.04 - 0.02));
      return val;
    });

    return {
      labels,
      datasets: [
        {
          type: 'line' as const,
          label: 'PRICE',
          data: prices,
          borderColor: stock.change >= 0 ? '#00D4AA' : '#FF4D6D',
          backgroundColor: stock.change >= 0 ? 'rgba(0, 212, 170, 0.1)' : 'rgba(255, 77, 109, 0.1)',
          fill: true,
          tension: 0.1,
          pointRadius: 0,
          borderWidth: 2,
          yAxisID: 'y',
        },
        {
          type: 'bar' as const,
          label: 'VOLUME',
          data: Array.from({ length: 40 }).map(() => Math.random() * 1000000),
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          yAxisID: 'y1',
        }
      ]
    };
  }, [stock]);

  if (!isOpen || !stock) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          onClick={onClose}
          className="absolute inset-0 bg-[#060B14]/80 backdrop-blur-sm"
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="relative w-full max-w-5xl max-h-[90vh] flex flex-col glass rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden border border-white/10"
        >
          {/* Header */}
          <div className="flex justify-between items-start p-6 border-b border-white/5 bg-[#080E19]">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-3xl font-black tracking-tight text-white">{stock.symbol.split('.')[0]}</h2>
                <span className="text-[10px] font-bold bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20 uppercase tracking-wider">EQ - NSE</span>
                <span className="text-[10px] font-bold bg-white/5 text-gray-400 px-2 py-0.5 rounded border border-white/10 uppercase tracking-wider">LARGE CAP</span>
              </div>
              <p className="text-sm font-medium text-gray-400">{stock.name}</p>
            </div>
            
            <div className="flex gap-2">
              <button className="w-8 h-8 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors">
                <Download className="w-4 h-4" />
              </button>
              <button className="w-8 h-8 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors">
                <Maximize2 className="w-4 h-4" />
              </button>
              <button onClick={onClose} className="w-8 h-8 rounded-lg bg-white/5 text-gray-400 hover:text-[#FF4D6D] hover:bg-[#FF4D6D]/10 flex items-center justify-center transition-colors ml-2">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex border-b border-white/5 bg-[#04080F]">
            {["Overview", "Chart", "Fundamentals", "AI Analysis", "News"].map(t => (
              <button 
                key={t}
                onClick={() => setActiveTab(t)}
                className={`px-6 py-3.5 text-sm font-bold transition-all relative ${activeTab === t ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
              >
                {t}
                {activeTab === t && <motion.div layoutId="tab" className="absolute bottom-0 left-0 w-full h-0.5 bg-[#00D4AA] rounded-t-full shadow-[0_0_8px_#00D4AA]" />}
              </button>
            ))}
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 scrollbar-hide bg-[#060B14]">
            
            <div className="flex justify-between items-end mb-8">
              <div>
                <PriceTag value={stock.price} prev={stock.prevClose} className="text-4xl xs:text-5xl font-black mb-2 inline-block" />
                <div className="flex items-center gap-3">
                  <ChangeBadge value={stock.changePercent} className="text-sm px-2 py-0.5" />
                  <span className="text-sm font-bold text-gray-500">
                    {stock.change >= 0 ? '+' : ''}₹{Math.abs(stock.change).toFixed(2)} Today
                  </span>
                </div>
              </div>
              <div className="text-right hidden sm:block">
                <div className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1 flex items-center justify-end gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00D4AA] animate-pulse"></span>
                  Real-time Data
                </div>
                <div className="text-sm font-mono text-gray-400">Vol: {(stock.volume / 100000).toFixed(2)}L</div>
              </div>
            </div>

            {activeTab === 'Overview' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="glass-card rounded-2xl p-5 border border-white/5">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Price Performance</h4>
                    <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
                      <div className="flex justify-between border-b border-white/5 pb-2">
                        <span className="text-gray-400 font-medium">Open</span>
                        <span className="font-bold font-mono">₹{stock.prevClose.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between border-b border-white/5 pb-2">
                        <span className="text-gray-400 font-medium">Prev Close</span>
                        <span className="font-bold font-mono text-gray-300">₹{stock.prevClose.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between border-b border-white/5 pb-2">
                        <span className="text-gray-400 font-medium">Day High</span>
                        <span className="font-bold font-mono text-[#00D4AA]">₹{stock.dayHigh.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between border-b border-white/5 pb-2">
                         <span className="text-gray-400 font-medium">Day Low</span>
                         <span className="font-bold font-mono text-[#FF4D6D]">₹{stock.dayLow.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="mt-6">
                      <div className="flex justify-between text-xs font-bold text-gray-400 mb-2">
                        <span>52W L: ₹{(stock.prevClose * 0.7).toFixed(2)}</span>
                        <span>52W H: ₹{(stock.prevClose * 1.4).toFixed(2)}</span>
                      </div>
                      <div className="w-full bg-[#060B14] rounded-full h-2 border border-white/5 overflow-hidden">
                        <div className="bg-gradient-to-r from-[#FF4D6D] via-blue-500 to-[#00D4AA] h-full" style={{ width: '100%' }}></div>
                      </div>
                      <div className="relative mt-1">
                        <div className="absolute w-2 h-2 bg-white rounded-full -top-1.5 shadow-[0_0_10px_white]" style={{ left: '75%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                   <div className="glass-card rounded-2xl p-5 border border-white/5 h-full">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Market Stats</h4>
                    <div className="grid grid-cols-1 gap-y-4 text-sm">
                      <div className="flex justify-between border-b border-white/5 pb-2">
                        <span className="text-gray-400 font-medium">Market Cap</span>
                        <span className="font-bold font-mono">₹1,840,432 Cr</span>
                      </div>
                      <div className="flex justify-between border-b border-white/5 pb-2">
                        <span className="text-gray-400 font-medium">P/E Ratio (TTM)</span>
                        <span className="font-bold font-mono">24.5x</span>
                      </div>
                      <div className="flex justify-between border-b border-white/5 pb-2">
                        <span className="text-gray-400 font-medium">Dividend Yield</span>
                        <span className="font-bold font-mono">1.2%</span>
                      </div>
                      <div className="flex justify-between border-b border-white/5 pb-2">
                        <span className="text-gray-400 font-medium">Book Value</span>
                        <span className="font-bold font-mono">₹450.20</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Chart' && chartData && (
              <div className="h-[400px] w-full mt-2">
                 <Chart 
                  type="line" 
                  data={chartData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: { mode: 'index', intersect: false },
                    scales: {
                      x: { grid: { color: 'rgba(255,255,255,0.02)' } },
                      y: {
                         type: 'linear',
                         display: true,
                         position: 'right',
                         grid: { color: 'rgba(255,255,255,0.05)' },
                      },
                      y1: {
                         type: 'linear',
                         display: false,
                         position: 'left',
                         min: 0,
                         max: 5000000
                      }
                    },
                    plugins: {
                      legend: { display: false }
                    }
                  }} 
                />
              </div>
            )}

            {activeTab === 'AI Analysis' && (
              <div className="space-y-6">
                <div className="glass-card rounded-2xl p-6 border border-[#00D4AA]/20 bg-gradient-to-br from-[#00D4AA]/5 to-transparent relative overflow-hidden">
                   <div className="absolute right-0 top-0 w-32 h-32 bg-[#00D4AA]/10 rounded-full blur-[40px]"></div>
                   
                   <div className="flex items-center gap-4 mb-6">
                     <SignalBadge type="BUY" confidence={94} className="text-sm px-4 py-1.5" />
                     <span className="text-[#00D4AA] font-bold">Strong Accumulation Detected</span>
                   </div>

                   <p className="text-gray-300 font-medium text-sm leading-relaxed mb-6">
                     Based on multiple ensemble models running technically weighted features, the probability of an upside breakout remains extremely high. Volume accumulation correlates positively with RSI momentum shifts observed yesterday. Price is comfortably sitting above the 50-day EMA support cluster.
                   </p>

                   <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                     <div className="bg-[#060B14]/50 border border-white/10 rounded-xl p-4 text-center">
                       <div className="text-[10px] text-gray-500 font-bold uppercase mb-1">Target Price</div>
                       <div className="text-xl font-bold font-mono text-[#00D4AA]">₹{(stock.price * 1.08).toFixed(2)}</div>
                     </div>
                     <div className="bg-[#060B14]/50 border border-white/10 rounded-xl p-4 text-center">
                       <div className="text-[10px] text-gray-500 font-bold uppercase mb-1">Stop Loss</div>
                       <div className="text-xl font-bold font-mono text-[#FF4D6D]">₹{(stock.price * 0.95).toFixed(2)}</div>
                     </div>
                     <div className="bg-[#060B14]/50 border border-white/10 rounded-xl p-4 text-center">
                       <div className="text-[10px] text-gray-500 font-bold uppercase mb-1">RSI (14)</div>
                       <div className="text-xl font-bold font-mono text-gray-200">58.4</div>
                     </div>
                     <div className="bg-[#060B14]/50 border border-white/10 rounded-xl p-4 text-center">
                       <div className="text-[10px] text-gray-500 font-bold uppercase mb-1">MACD</div>
                       <div className="text-xl font-bold font-mono text-[#00D4AA]">Bullish</div>
                     </div>
                   </div>
                </div>
              </div>
            )}
            
            {activeTab !== 'Overview' && activeTab !== 'Chart' && activeTab !== 'AI Analysis' && (
              <div className="h-64 flex flex-col items-center justify-center text-gray-500 border border-white/5 border-dashed rounded-2xl">
                <Activity className="w-8 h-8 mb-3 opacity-50" />
                <p className="font-medium text-sm">Detailed {activeTab.toLowerCase()} data would load here seamlessly.</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

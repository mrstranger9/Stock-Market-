"use client";

import { usePortfolioData } from "@/lib/market-simulator";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { EquityCurve } from "@/components/dashboard/equity-curve";
import { LiveStocksTable } from "@/components/dashboard/live-stocks-table";
import { SignalBadge } from "@/components/ui/signal-badge";
import { Zap, Activity, Target, BellRing, Info, Wallet } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import Link from 'next/link';

export default function Dashboard() {
  const { totalValue, dailyPnl, dailyPnlPercent, activePositions, accuracy, pendingAlerts } = usePortfolioData();
  const [timeRange, setTimeRange] = useState("1M");

  const kpis = [
    { title: "Portfolio Value", value: `₹${(totalValue / 100000).toFixed(2)}L`, change: `+₹${dailyPnl.toLocaleString('en-IN')}`, changePct: `+${dailyPnlPercent.toFixed(2)}%`, icon: Wallet, isPos: dailyPnl >= 0 },
    { title: "Today's P&L", value: `+₹${Math.abs(dailyPnl).toLocaleString('en-IN')}`, subtext: "Realized: ₹2,140", icon: Activity, isPos: dailyPnl >= 0 },
    { title: "Active Positions", value: activePositions.toString(), subtext: "5 Long / 2 Short", icon: Target, isPos: true },
    { title: "AI Signal Accuracy", value: `${accuracy}%`, subtext: "+1.2% this month", icon: Zap, isPos: true },
    { title: "Pending Alerts", value: pendingAlerts.toString(), subtext: "2 Price, 1 News", icon: BellRing, isPos: null },
  ];

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 w-full max-w-[1600px] mx-auto pb-10">
        
        {/* ROW 1: Welcome */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mt-2">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white mb-1">Hey Hello, Admin 👋</h1>
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-400">
              <span className="w-2 h-2 rounded-full bg-[#00D4AA] animate-pulse"></span>
              NSE is Open <span className="text-gray-600 px-1">•</span> 3h 24m remaining
            </div>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
            <Link href="/orders" className="whitespace-nowrap bg-[#0F1928] hover:bg-[#1a2536] border border-white/10 text-white font-bold py-2 px-4 rounded-xl shadow-sm transition-colors text-sm">
              + New Order
            </Link>
            <Link href="/signal-engine" className="whitespace-nowrap bg-gradient-to-r from-blue-900/40 to-[#00D4AA]/20 border border-[#00D4AA]/30 hover:border-[#00D4AA]/60 text-[#00D4AA] font-bold py-2 px-4 rounded-xl shadow-sm transition-all text-sm group flex items-center">
              <Zap className="w-4 h-4 inline-block mr-1.5 group-hover:scale-110 transition-transform" /> Generate Signal
            </Link>
            <Link href="/backtesting" className="whitespace-nowrap bg-[#0F1928] hover:bg-[#1a2536] border border-white/10 text-white font-bold py-2 px-4 rounded-xl shadow-sm transition-colors text-sm">
              Run Backtest
            </Link>
          </div>
        </div>

        {/* ROW 2: KPI CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
          {kpis.map((kpi, i) => (
            <div key={i} className="glass-card rounded-2xl p-5 flex flex-col justify-between group overflow-hidden relative">
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/[0.02] rounded-full blur-[20px] group-hover:bg-white/[0.04] transition-colors pointer-events-none"></div>
              
              <div className="flex justify-between items-start mb-4">
                <div className="w-8 h-8 rounded-lg bg-gray-800/80 border border-white/5 flex items-center justify-center">
                  <kpi.icon className={cn("w-4 h-4", kpi.isPos === true ? "text-[#00D4AA]" : kpi.isPos === false ? "text-[#FF4D6D]" : "text-blue-400")} />
                </div>
                {kpi.changePct && (
                  <span className={cn("text-xs font-bold px-1.5 py-0.5 rounded", kpi.isPos ? "bg-[#00D4AA]/10 text-[#00D4AA]" : "bg-[#FF4D6D]/10 text-[#FF4D6D]")}>
                    {kpi.changePct}
                  </span>
                )}
              </div>
              
              <div className="relative z-10">
                <p className="text-gray-500 font-bold text-xs uppercase tracking-wider mb-1">{kpi.title}</p>
                <h3 className="text-2xl font-black tabular-nums tracking-tight">{kpi.value}</h3>
                
                <div className="mt-2 text-xs font-bold text-gray-400 flex items-center gap-1.5">
                  {(kpi.change || kpi.subtext) && (
                    <span className={cn(kpi.isPos && kpi.change ? "text-[#00D4AA]" : kpi.isPos === false && kpi.change ? "text-[#FF4D6D]" : "")}>
                      {kpi.change || kpi.subtext}
                    </span>
                  )}
                  {kpi.change && <span className="opacity-60 font-medium">today</span>}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ROW 3: Main Grid (2/3 + 1/3) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LEFT 2/3 COLUMN */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Equity Curve */}
            <div className="glass-card rounded-2xl p-6 h-[400px] flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="font-bold text-lg flex items-center gap-2">Portfolio Performance</h3>
                </div>
                <div className="flex border border-white/10 rounded-lg p-0.5 bg-[#060B14]">
                  {['1D', '1W', '1M', '3M', '6M', '1Y'].map(t => (
                    <button 
                      key={t}
                      onClick={() => setTimeRange(t)}
                      className={cn(
                        "px-3 py-1.5 text-xs font-bold rounded-md transition-colors",
                        timeRange === t ? "bg-white/10 text-white shadow-sm" : "text-gray-500 hover:text-white"
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex-1 min-h-0 w-full relative -ml-2">
                <EquityCurve timeRange={timeRange} />
              </div>
            </div>

            {/* Indian Stocks Table */}
            <div className="glass-card rounded-2xl overflow-hidden border border-white/5">
              <div className="p-5 border-b border-white/5 flex justify-between items-center bg-[#080E19]/80">
                <h3 className="font-bold text-lg">NIFTY 50 Universe</h3>
                <div className="relative">
                  <input type="text" placeholder="Filter stocks..." className="bg-[#060B14] border border-white/10 rounded-lg py-1.5 px-3 text-xs w-48 focus:outline-none focus:border-[#00D4AA]/50" />
                </div>
              </div>
              <LiveStocksTable />
            </div>
            
          </div>

          {/* RIGHT 1/3 COLUMN */}
          <div className="space-y-6">
            
            {/* AI Insights */}
            <div className="rounded-2xl p-1 bg-gradient-to-b from-[#00D4AA]/20 via-[#0F1928] to-[#0F1928] shadow-[0_0_30px_rgba(0,212,170,0.05)]">
              <div className="bg-[#0F1928] rounded-xl h-full p-6">
                <div className="flex items-center gap-3 mb-5 border-b border-white/5 pb-4">
                  <div className="w-10 h-10 rounded-lg bg-[#00D4AA]/10 border border-[#00D4AA]/20 flex items-center justify-center text-[#00D4AA]">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg leading-tight text-white">AI Market Insights</h3>
                    <p className="text-[10px] text-[#00D4AA] font-bold uppercase tracking-wider">Powered by Genkit</p>
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="flex justify-between items-center mb-2 text-sm font-bold">
                    <span className="text-gray-400">Market Sentiment</span>
                    <span className="text-[#00D4AA]">Bullish 73%</span>
                  </div>
                  
                  <div className="w-full bg-[#060B14] rounded-full h-2 border border-white/5 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-[#00D4AA] h-full rounded-full w-[73%]"></div>
                  </div>

                  <div className="space-y-3 mt-6">
                    {[
                      { text: "Banking sector showing strong accumulation patterns", conf: 88, pos: true },
                      { text: "IT stocks facing resistance at 50-SMA", conf: 72, pos: false },
                      { text: "FII buying momentum detected in large caps", conf: 91, pos: true }
                    ].map((insight, i) => (
                      <div key={i} className="flex gap-3 items-start p-3.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
                        <Info className={cn("w-4 h-4 shrink-0 mt-0.5", insight.pos ? "text-[#00D4AA]" : "text-[#FF4D6D]")} />
                        <div>
                          <p className="text-sm font-medium text-gray-200 leading-snug">{insight.text}</p>
                          <div className="text-[10px] text-gray-500 font-bold mt-1.5 uppercase tracking-wider">Confidence: {insight.conf}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Active Alerts */}
            <div className="glass-card rounded-2xl p-6 border border-white/5">
              <h3 className="font-bold text-base mb-5 flex items-center gap-2">
                <BellRing className="w-4 h-4 text-amber-500" /> Active Alerts
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-sm text-gray-200">RELIANCE</span>
                      <span className="text-[10px] bg-[#00D4AA]/20 text-[#00D4AA] px-1.5 py-0.5 rounded font-bold">TRIGGERED</span>
                    </div>
                    <p className="text-xs text-gray-400 font-medium">Crossed above ₹2,850.00</p>
                  </div>
                  <div className="font-mono text-sm font-bold text-white">₹2,852.30</div>
                </div>
                <div className="flex justify-between items-center p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-sm text-gray-200">HDFCBANK</span>
                      <span className="text-[10px] bg-amber-500/10 text-amber-500 px-1.5 py-0.5 rounded font-bold border border-amber-500/20">PENDING</span>
                    </div>
                    <p className="text-xs text-gray-400 font-medium">Target drop info below ₹1,630</p>
                  </div>
                  <div className="font-mono text-sm font-bold text-gray-500">₹1,642.00</div>
                </div>
              </div>
            </div>

            {/* Signal Distribution Donut Placeholder */}
            <div className="glass-card rounded-2xl p-6 border border-white/5 flex flex-col items-center justify-center min-h-[200px]">
               <h3 className="font-bold text-sm text-gray-400 uppercase tracking-wider mb-4 border-b border-white/5 pb-2 w-full text-center">Signal Distribution</h3>
               <div className="relative w-32 h-32 rounded-full border-[12px] border-[#00D4AA] border-r-blue-500 border-b-[#FF4D6D] border-l-[#00D4AA] flex items-center justify-center shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                 <div className="text-center absolute">
                   <div className="font-mono font-bold text-xl">1,284</div>
                   <div className="text-[10px] text-gray-500 font-bold uppercase">Signals</div>
                 </div>
               </div>
               <div className="flex gap-4 mt-6 text-xs font-bold">
                 <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#00D4AA]"></div> BUY 45%</div>
                 <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-500"></div> HOLD 32%</div>
                 <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#FF4D6D]"></div> SELL 23%</div>
               </div>
            </div>

          </div>
        </div>

        {/* ROW 4: AI Prediction Timeline */}
        <div className="mt-4 glass-card rounded-2xl border border-white/5 overflow-hidden">
          <div className="p-5 border-b border-white/5 flex justify-between items-center bg-[#080E19]/80">
            <h3 className="font-bold text-lg">AI Prediction Timeline</h3>
            <button className="text-sm text-[#00D4AA] font-bold hover:underline">View All Signals</button>
          </div>
          <div className="w-full overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-[10px] text-gray-500 uppercase tracking-widest bg-white/[0.02] border-b border-white/5 font-bold">
                <tr>
                  <th className="px-6 py-4">Asset</th>
                  <th className="px-6 py-4">Signal</th>
                  <th className="px-6 py-4">Confidence</th>
                  <th className="px-6 py-4 text-right">Entry</th>
                  <th className="px-6 py-4 text-right">Target</th>
                  <th className="px-6 py-4 text-right">Stop Loss</th>
                  <th className="px-6 py-4">Timeframe</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {[
                  { sym: 'TCS.NS', type: 'BUY', conf: 92, entry: 3890, tg: 3950, sl: 3840, tf: 'Intraday', stat: 'Active' },
                  { sym: 'INFY.NS', type: 'SELL', conf: 85, entry: 1450, tg: 1420, sl: 1465, tf: 'Swing', stat: 'Triggered' },
                  { sym: 'SBIN.NS', type: 'BUY', conf: 78, entry: 780, tg: 810, sl: 765, tf: 'Positional', stat: 'Pending' }
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-200">{row.sym.split('.')[0]}</td>
                    <td className="px-6 py-4"><SignalBadge type={row.type as any} confidence={row.conf} /></td>
                    <td className="px-6 py-4">
                      <div className="w-24 bg-[#060B14] rounded-full h-1.5 border border-white/5 overflow-hidden">
                        <div className={cn("h-1.5 rounded-full", row.conf > 90 ? "bg-[#00D4AA]" : row.conf > 80 ? "bg-blue-400" : "bg-amber-400")} style={{ width: `${row.conf}%` }}></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-mono font-bold text-gray-300">₹{row.entry}</td>
                    <td className="px-6 py-4 text-right font-mono font-bold text-[#00D4AA]">₹{row.tg}</td>
                    <td className="px-6 py-4 text-right font-mono font-bold text-[#FF4D6D]">₹{row.sl}</td>
                    <td className="px-6 py-4 text-gray-500 font-bold text-xs uppercase tracking-wider">{row.tf}</td>
                    <td className="px-6 py-4">
                      <span className={cn("text-[10px] font-bold px-2 py-1 rounded-sm border uppercase tracking-wider", 
                        row.stat === 'Active' ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                        row.stat === 'Triggered' ? "bg-[#00D4AA]/10 text-[#00D4AA] border-[#00D4AA]/20" :
                        "bg-white/5 text-gray-400 border-white/10"
                      )}>{row.stat}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
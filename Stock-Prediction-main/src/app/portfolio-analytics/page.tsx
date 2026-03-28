"use client";

import { usePortfolioData, INDIAN_STOCKS } from "@/lib/market-simulator";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PriceTag } from "@/components/ui/price-tag";
import { ChangeBadge } from "@/components/ui/change-badge";
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { TrendingUp, TrendingDown, PieChart, Activity, Grip, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PortfolioAnalytics() {
  const { totalValue, dailyPnl, dailyPnlPercent } = usePortfolioData();
  
  const totalInvested = 350000;
  const overallPnl = totalValue - totalInvested;
  const overallPnlPercent = (overallPnl / totalInvested) * 100;
  const isOverallPos = overallPnl >= 0;

  const pieData = {
    labels: ['Financials', 'IT', 'Energy', 'FMCG', 'Others'],
    datasets: [{
      data: [35, 25, 20, 15, 5],
      backgroundColor: ['#00D4AA', '#3b82f6', '#8b5cf6', '#f59e0b', '#4b5563'],
      borderWidth: 0,
      hoverOffset: 4
    }]
  };

  const holdings = [
    { sym: 'HDFCBANK.NS', qty: 50, avg: 1510.50, cmp: 1642.00, sig: 'BUY' },
    { sym: 'TCS.NS', qty: 25, avg: 3650.00, cmp: 3892.45, sig: 'HOLD' },
    { sym: 'RELIANCE.NS', qty: 30, avg: 2710.20, cmp: 2847.50, sig: 'BUY' },
    { sym: 'INFY.NS', qty: 40, avg: 1550.00, cmp: 1460.10, sig: 'SELL' },
  ];

  return (
    <DashboardLayout>
      <div className="w-full max-w-7xl mx-auto pb-10">
        
        <div className="flex justify-between items-end mb-8">
           <div>
             <h1 className="text-3xl font-black text-white flex items-center gap-3">
                <PieChart className="w-8 h-8 text-[#00D4AA]" /> Portfolio Analytics
             </h1>
             <p className="text-gray-400 font-medium mt-1">Deep institutional insights into your equity allocation</p>
           </div>
           <button className="bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold px-4 py-2 rounded-lg transition-colors text-sm">Download Tax Report</button>
        </div>

        {/* ROW 1: Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="glass-card rounded-2xl border border-white/5 p-5">
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-2">Total Invested</p>
            <h3 className="text-xl font-bold font-mono text-white">₹{(totalInvested).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</h3>
          </div>
          <div className="glass-card rounded-2xl border border-[#00D4AA]/20 bg-[#00D4AA]/5 p-5">
            <p className="text-[10px] text-[#00D4AA] font-bold uppercase tracking-wider mb-2">Current Value</p>
            <h3 className="text-xl font-bold font-mono text-[#00D4AA]">₹{(totalValue).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</h3>
          </div>
          <div className={cn("glass-card rounded-2xl border p-5", isOverallPos ? "border-[#00D4AA]/10" : "border-[#FF4D6D]/10")}>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-2">Overall P&L</p>
            <div className="flex items-center gap-2">
              <h3 className={cn("text-xl font-bold font-mono", isOverallPos ? "text-[#00D4AA]" : "text-[#FF4D6D]")}>
                {isOverallPos ? '+' : ''}₹{Math.abs(overallPnl).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </h3>
            </div>
            <div className={cn("text-xs font-bold mt-1", isOverallPos ? "text-[#00D4AA]" : "text-[#FF4D6D]")}>
               {isOverallPos ? '+' : ''}{overallPnlPercent.toFixed(2)}%
            </div>
          </div>
          <div className="glass-card rounded-2xl border border-white/5 p-5">
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-2">Est. XIRR</p>
            <h3 className="text-xl font-bold font-mono text-[#00D4AA]">+24.5%</h3>
            <p className="text-[10px] text-gray-400 mt-1 uppercase">Annualized</p>
          </div>
          <div className="glass-card rounded-2xl border border-white/5 p-5 flex flex-col justify-between">
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-2 flex items-center gap-1"><TrendingUp className="w-3 h-3 text-[#00D4AA]" /> Top Gainer</p>
              <h3 className="text-xs text-white font-bold leading-none">HDFCBANK <span className="text-[#00D4AA] ml-1">+18.4%</span></h3>
            </div>
            <div className="mt-2">
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-2 flex items-center gap-1"><TrendingDown className="w-3 h-3 text-[#FF4D6D]" /> Top Loser</p>
              <h3 className="text-xs text-white font-bold leading-none">INFY <span className="text-[#FF4D6D] ml-1">-5.8%</span></h3>
            </div>
          </div>
        </div>

        {/* ROW 2: Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
           <div className="glass-card rounded-2xl border border-white/5 p-6 h-80 flex flex-col items-center">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest text-left w-full mb-4 border-b border-white/5 pb-2">Sector Allocation</h3>
              <div className="flex-1 w-full max-w-[200px] relative flex items-center justify-center">
                 <Doughnut data={pieData} options={{ maintainAspectRatio: false, cutout: '75%', plugins: { legend: { display: false } } }} />
                 <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                    <span className="text-2xl font-bold text-white">5</span>
                    <span className="text-[10px] text-gray-500 font-bold uppercase">Sectors</span>
                 </div>
              </div>
           </div>

           <div className="lg:col-span-2 glass-card rounded-2xl border border-white/5 p-6 h-80">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 border-b border-white/5 pb-2 flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-400" /> Advanced Risk Metrics
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-6">
                 <div>
                   <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Sharpe Ratio</p>
                   <div className="text-xl font-mono font-bold text-[#00D4AA]">2.14 <span className="text-xs text-gray-400 font-sans ml-1">Excellent</span></div>
                 </div>
                 <div>
                   <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Sortino Ratio</p>
                   <div className="text-xl font-mono font-bold text-[#00D4AA]">3.45</div>
                 </div>
                 <div>
                   <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Max Drawdown</p>
                   <div className="text-xl font-mono font-bold text-[#FF4D6D]">-12.4%</div>
                 </div>
                 <div>
                   <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Portfolio Beta</p>
                   <div className="text-xl font-mono font-bold text-blue-400">0.85 <span className="text-xs text-gray-400 font-sans ml-1">Low Volatility</span></div>
                 </div>
                 <div>
                   <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Jensen's Alpha</p>
                   <div className="text-xl font-mono font-bold text-[#00D4AA]">+4.2%</div>
                 </div>
                 <div>
                   <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Win Rate</p>
                   <div className="text-xl font-mono font-bold text-white">68.5%</div>
                 </div>
              </div>
           </div>
        </div>

        {/* ROW 3: Holdings */}
        <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
          <div className="p-5 border-b border-white/5 bg-[#080E19]/80 flex justify-between items-center">
            <h3 className="font-bold text-lg text-white">Current Holdings</h3>
            <button className="text-sm text-[#00D4AA] font-bold">Manage Position Sizing</button>
          </div>
          <div className="w-full overflow-x-auto">
             <table className="w-full text-sm text-left">
               <thead className="text-[10px] text-gray-500 uppercase tracking-widest bg-white/[0.02] border-b border-white/5 font-bold">
                 <tr>
                    <th className="px-6 py-4">Symbol</th>
                    <th className="px-6 py-4 text-right">Qty</th>
                    <th className="px-6 py-4 text-right">Avg Price</th>
                    <th className="px-6 py-4 text-right">CMP</th>
                    <th className="px-6 py-4 text-right">Invested</th>
                    <th className="px-6 py-4 text-right">Current Value</th>
                    <th className="px-6 py-4 text-right">P&L</th>
                    <th className="px-6 py-4 text-center">AI Signal</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-white/5">
                 {holdings.map((h, i) => {
                   const invested = h.qty * h.avg;
                   const current = h.qty * h.cmp;
                   const pnl = current - invested;
                   const pnlPct = (pnl / invested) * 100;

                   return (
                     <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4 font-bold text-white">{h.sym.split('.')[0]}</td>
                        <td className="px-6 py-4 text-right font-mono text-gray-300">{h.qty}</td>
                        <td className="px-6 py-4 text-right font-mono text-gray-400">₹{h.avg.toFixed(2)}</td>
                        <td className="px-6 py-4 text-right font-mono font-bold text-white">₹{h.cmp.toFixed(2)}</td>
                        <td className="px-6 py-4 text-right font-mono text-gray-400">₹{invested.toLocaleString()}</td>
                        <td className="px-6 py-4 text-right font-mono font-bold text-white">₹{current.toLocaleString()}</td>
                        <td className={cn("px-6 py-4 text-right font-mono font-bold", pnl >= 0 ? "text-[#00D4AA]" : "text-[#FF4D6D]")}>
                          {pnl >= 0 ? '+' : ''}₹{pnl.toLocaleString(undefined, { maximumFractionDigits: 0 })} <br/>
                          <span className="text-[10px]">{pnlPct >= 0 ? '+' : ''}{pnlPct.toFixed(2)}%</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={cn(
                            "text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-wider",
                            h.sig === 'BUY' ? "bg-[#00D4AA]/10 text-[#00D4AA]" : h.sig === 'SELL' ? "bg-[#FF4D6D]/10 text-[#FF4D6D]" : "bg-blue-500/10 text-blue-400"
                          )}>
                             {h.sig}
                          </span>
                        </td>
                     </tr>
                   )
                 })}
               </tbody>
             </table>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}

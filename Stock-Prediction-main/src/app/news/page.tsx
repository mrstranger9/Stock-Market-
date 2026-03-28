"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Newspaper, Bot, Search, ExternalLink, Calendar, Clock } from "lucide-react";

export default function NewsPage() {
  const news = [
    {
       stock: "RELIANCE",
       headline: "Reliance Retail to launch fast-fashion brand, targets ₹1,000 Cr revenue",
       time: "15 mins ago",
       src: "Economic Times",
       aiSummary: "Positive catalyst. The rollout into high-margin fast fashion competes directly with Zudio, expanding Retail's addressable market. Genkit sentiment analysis marks this heavily Bullish for short-term retail sector allocation.",
       sentiment: "Bullish"
    },
    {
       stock: "HDFCBANK",
       headline: "HDFC Bank Q4 NIMs likely to remain under pressure due to deposit repricing",
       time: "2 hours ago",
       src: "Moneycontrol",
       aiSummary: "Bearish bias. Sustained cost of funds pressure might temper the 19% loan growth narrative. Short-term downside expected until NIM stabilization is explicitly guided by management.",
       sentiment: "Bearish"
    },
    {
       stock: "TCS",
       headline: "TCS bags $500M mega-deal from European telecom operator",
       time: "5 hours ago",
       src: "Mint",
       aiSummary: "Bullish setup. The TCV addition strengthens the standard revenue run rate for FY25, offsetting broader macro slowdown fears in Europe.",
       sentiment: "Bullish"
    }
  ];

  return (
    <DashboardLayout>
      <div className="w-full max-w-7xl mx-auto pb-10">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 border-b border-white/5 pb-6">
          <div>
            <h1 className="text-3xl font-black text-white flex items-center gap-3">
               <Newspaper className="w-7 h-7 text-[#00D4AA]" /> Market Intelligence
            </h1>
            <p className="text-gray-400 font-medium mt-2">Real-time financial news with AI-generated institutional summaries</p>
          </div>
          
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto hide-scrollbar">
             {["All News", "Portfolio", "Watchlist", "Earnings", "Global"].map(t => (
               <button key={t} className="bg-[#080E19] border border-white/10 hover:bg-white/10 text-white font-bold px-4 py-2 rounded-xl text-sm transition-colors whitespace-nowrap">
                 {t}
               </button>
             ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {news.map((item, i) => (
             <div key={i} className="glass-card rounded-2xl border border-white/5 overflow-hidden flex flex-col group">
                <div className="p-5 border-b border-white/5 bg-[#080E19]/50 flex-1">
                   <div className="flex justify-between items-center mb-3 text-xs font-bold">
                     <span className="text-white bg-white/10 px-2 py-0.5 rounded uppercase tracking-widest">{item.stock}</span>
                     <span className="text-gray-500 flex items-center gap-1"><Clock className="w-3 h-3"/> {item.time}</span>
                   </div>
                   
                   <h3 className="text-lg font-bold text-white mb-2 leading-snug group-hover:text-[#00D4AA] transition-colors cursor-pointer">{item.headline}</h3>
                   <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest flex items-center gap-1 mb-4">
                     Source: {item.src} <ExternalLink className="w-3 h-3 mb-0.5" />
                   </div>
                </div>

                <div className="p-5 bg-gradient-to-br from-[#00D4AA]/5 to-transparent border-t border-[#00D4AA]/10 relative">
                   <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-[#00D4AA] uppercase tracking-widest flex items-center gap-1.5"><Bot className="w-3.5 h-3.5" /> AI Synthesis</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${item.sentiment === 'Bullish' ? 'bg-[#00D4AA]/20 text-[#00D4AA]' : 'bg-[#FF4D6D]/20 text-[#FF4D6D]'}`}>{item.sentiment}</span>
                   </div>
                   <p className="text-sm font-medium text-gray-300 leading-relaxed">
                     {item.aiSummary}
                   </p>
                </div>
             </div>
           ))}
        </div>

      </div>
    </DashboardLayout>
  );
}

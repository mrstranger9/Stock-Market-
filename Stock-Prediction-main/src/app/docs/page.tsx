"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { BookOpen, Code, Terminal, Book, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DocsPage() {
  const topics = [
    { title: "Getting Started", items: ["Platform Overview", "Keyboard Shortcuts", "Connecting Broker Accounts"] },
    { title: "API Documentation", items: ["REST API Endpoints", "WebSocket Data Feeds", "Authentication Headers"] },
    { title: "Trading Features", items: ["Creating Custom Screeners", "Configuring Server Alerts", "Backtesting Formats"] }
  ];

  return (
    <DashboardLayout>
      <div className="w-full max-w-6xl mx-auto pb-10">
        
        <div className="mb-8 border-b border-white/5 pb-6">
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
             <BookOpen className="w-8 h-8 text-[#00D4AA]" /> Help & Documentation
          </h1>
          <p className="text-gray-400 font-medium mt-2">Comprehensive guides for platform utilization and API integration</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <div className="glass-card rounded-2xl p-6 flex flex-col items-center text-center cursor-pointer hover:border-[#00D4AA]/50 group transition-all">
                <div className="w-14 h-14 rounded-full bg-[#00D4AA]/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                   <Terminal className="w-7 h-7 text-[#00D4AA]" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">API Reference</h3>
                <p className="text-sm font-medium text-gray-400">Integrate algorithmic execution natively via Python.</p>
            </div>
            
            <div className="glass-card rounded-2xl p-6 flex flex-col items-center text-center cursor-pointer hover:border-[#00D4AA]/50 group transition-all">
                <div className="w-14 h-14 rounded-full bg-blue-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                   <Code className="w-7 h-7 text-blue-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Tutorials</h3>
                <p className="text-sm font-medium text-gray-400">Step by step guides on setting out advanced UI layouts.</p>
            </div>

            <div className="glass-card rounded-2xl p-6 flex flex-col items-center text-center cursor-pointer hover:border-[#00D4AA]/50 group transition-all">
                <div className="w-14 h-14 rounded-full bg-[#FF4D6D]/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                   <Book className="w-7 h-7 text-[#FF4D6D]" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Support Tickets</h3>
                <p className="text-sm font-medium text-gray-400">Contact institutional customer success managers.</p>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
           {topics.map((block, i) => (
             <div key={i}>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">{block.title}</h4>
                <div className="space-y-3">
                   {block.items.map((item, j) => (
                      <div key={j} className="flex items-center gap-2 text-sm font-bold text-gray-300 hover:text-[#00D4AA] cursor-pointer transition-colors group p-2 rounded-lg hover:bg-[#00D4AA]/5 -ml-2">
                         <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-[#00D4AA]" />
                         {item}
                      </div>
                   ))}
                </div>
             </div>
           ))}
        </div>

      </div>
    </DashboardLayout>
  );
}

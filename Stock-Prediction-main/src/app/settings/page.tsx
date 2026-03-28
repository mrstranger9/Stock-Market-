"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { User, Bell, Shield, KeyRound, MonitorSmartphone, Settings2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="w-full max-w-5xl mx-auto pb-10">
        
        <div className="mb-8 border-b border-white/5 pb-6">
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
             <Settings2 className="w-8 h-8 text-[#00D4AA]" /> Preferences
          </h1>
          <p className="text-gray-400 font-medium mt-2">Manage trading execution rules, API keys, and notification channels</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
           <div className="w-full md:w-64 space-y-2 shrink-0">
             {[
               { icon: User, label: "Account Profile", active: true },
               { icon: Bell, label: "Notifications" },
               { icon: KeyRound, label: "Broker API Keys" },
               { icon: MonitorSmartphone, label: "Terminal Appearance" }
             ].map((t, i) => (
                <button key={i} className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all",
                  t.active ? "bg-[#00D4AA]/10 text-[#00D4AA]" : "text-gray-400 hover:text-white hover:bg-white/5"
                )}>
                   <t.icon className="w-4 h-4" /> {t.label}
                </button>
             ))}
           </div>

           <div className="flex-1 space-y-6">
              <div className="glass-card rounded-2xl border border-white/5 p-6">
                 <h3 className="text-lg font-bold text-white mb-6 border-b border-white/5 pb-4">Personal Details</h3>
                 <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Full Name</label>
                       <input type="text" defaultValue="Admin User" className="w-full bg-[#060B14] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#00D4AA]/50 font-medium" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Email Address</label>
                       <input type="email" defaultValue="admin@quantaxis.com" className="w-full bg-[#060B14] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#00D4AA]/50 font-medium" />
                    </div>
                 </div>
              </div>

              <div className="glass-card rounded-2xl border border-white/5 p-6">
                 <h3 className="text-lg font-bold text-white mb-6 border-b border-white/5 pb-4 items-center flex justify-between">
                    API Execution Keys
                    <span className="text-[10px] bg-[#00D4AA]/20 text-[#00D4AA] px-2 py-0.5 rounded uppercase tracking-wider">Zerodha Kite Linked</span>
                 </h3>
                 <div className="space-y-4">
                    <div className="space-y-2">
                       <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">API Key</label>
                       <input type="password" defaultValue="**********************" className="w-full bg-[#060B14] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none font-mono text-gray-400" disabled />
                    </div>
                 </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                 <button className="px-6 py-2.5 rounded-xl border border-white/10 text-white font-bold text-sm hover:bg-white/5 transition-colors">Discard</button>
                 <button className="px-6 py-2.5 rounded-xl bg-[#00D4AA] text-[#060B14] font-black text-sm hover:bg-[#00D4AA]/90 shadow-[0_0_15px_rgba(0,212,170,0.2)] transition-colors">Save Configurations</button>
              </div>
           </div>
        </div>

      </div>
    </DashboardLayout>
  );
}

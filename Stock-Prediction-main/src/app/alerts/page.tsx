"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Bell, Play, Trash2, Edit3, Smartphone, Mail, X, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";
import { useMarketData } from "@/lib/market-simulator";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

export default function AlertsPage() {
  const { marketData } = useMarketData();
  const { toast } = useToast();
  const [alertsList, setAlertsList] = useState([
    { stock: "RELIANCE.NS", cond: "Price crosses above", target: "₹ 2,900.00", method: "Push + Email", active: true },
    { stock: "HDFCBANK.NS", cond: "Price falls below", target: "₹ 1,550.00", method: "SMS", active: true },
    { stock: "INFY.NS", cond: "Volume spike >", target: "300%", method: "Push", active: false },
    { stock: "TCS.NS", cond: "MACD crosses Signal", target: "Daily TF", method: "Email", active: true }
  ]);
  const triggeredReactions = useRef<Record<string, number>>({});

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newStock, setNewStock] = useState("RELIANCE.NS");
  const [newCond, setNewCond] = useState("Price crosses above");
  const [newTarget, setNewTarget] = useState("");

  const handleCreate = () => {
    if (!newTarget) return;
    setAlertsList([
      { stock: newStock, cond: newCond, target: newTarget.startsWith('₹') ? newTarget : `₹ ${newTarget}`, method: "Push + Email", active: true },
      ...alertsList
    ]);
    setIsModalOpen(false);
    setNewTarget("");
  };

  const deleteAlert = (idx: number) => {
    const arr = [...alertsList];
    arr.splice(idx, 1);
    setAlertsList(arr);
  };

  const toggleAlert = (idx: number) => {
    const arr = [...alertsList];
    arr[idx].active = !arr[idx].active;
    setAlertsList(arr);
  };

  // Real-time monitoring logic
  useEffect(() => {
    alertsList.forEach((alert, index) => {
      if (!alert.active) return;
      
      const data = marketData[alert.stock];
      if (!data) return;

      const currentPrice = data.price;
      const targetStr = alert.target.replace(/[₹\s,]/g, '');
      const targetPrice = parseFloat(targetStr);

      if (isNaN(targetPrice)) return;

      let triggered = false;
      if (alert.cond === "Price crosses above" && currentPrice >= targetPrice) {
        triggered = true;
      } else if (alert.cond === "Price falls below" && currentPrice <= targetPrice) {
        triggered = true;
      }

      if (triggered) {
        const key = `${alert.stock}-${alert.cond}-${alert.target}`;
        const lastTrigger = triggeredReactions.current[key] || 0;
        const now = Date.now();
        
        // Trigger only once every 30 seconds to avoid spam
        if (now - lastTrigger > 30000) {
          triggeredReactions.current[key] = now;
          toast({
            title: "🔔 Alert Triggered!",
            description: `${alert.stock.split('.')[0]} matched condition: ${alert.cond} ${alert.target} (Current: ₹${currentPrice.toFixed(2)})`,
            variant: "default",
          });
        }
      }
    });
  }, [marketData, alertsList, toast]);

  return (
    <DashboardLayout>
      <div className="w-full max-w-6xl mx-auto pb-10">
        
        <div className="mb-8 border-b border-white/5 pb-6 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black text-white flex items-center gap-3">
               <Bell className="w-8 h-8 text-[#00D4AA]" /> Trading Alerts
            </h1>
            <p className="text-gray-400 font-medium mt-2">Manage server-side price alerts and technical condition triggers</p>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="bg-[#00D4AA] text-[#060B14] font-black px-6 py-2.5 rounded-xl flex items-center gap-2 hover:bg-[#00D4AA]/90 shadow-[0_0_15px_rgba(0,212,170,0.3)] transition shrink-0">
            <Plus className="w-4 h-4" /> Create New Alert
          </button>
        </div>

        <div className="glass-card rounded-2xl border border-white/5 p-6 mb-8">
           <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg text-white">Active Configurations ({alertsList.length})</h3>
           </div>
           
           <div className="w-full overflow-x-auto hide-scrollbar">
             <table className="w-full text-sm text-left">
               <thead className="text-[10px] text-gray-500 uppercase tracking-widest bg-white/[0.02] border-b border-white/5 font-bold">
                 <tr>
                    <th className="px-6 py-4">Symbol</th>
                    <th className="px-6 py-4">Trigger Condition</th>
                    <th className="px-6 py-4">Target Value</th>
                    <th className="px-6 py-4">Notification Method</th>
                    <th className="px-6 py-4 text-center">Status</th>
                    <th className="px-6 py-4 text-center">Actions</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-white/5">
                 {alertsList.length === 0 && (
                   <tr>
                     <td colSpan={6} className="text-center py-10 text-gray-500 font-medium">No alerts configured. Click 'Create New Alert' to begin.</td>
                   </tr>
                 )}
                 {alertsList.map((a, i) => (
                   <tr key={i} className={cn("transition-colors", a.active ? "hover:bg-white/[0.02]" : "opacity-50")}>
                      <td className="px-6 py-4 font-bold text-white">{a.stock.split('.')[0]}</td>
                      <td className="px-6 py-4 text-gray-400 font-medium">{a.cond}</td>
                      <td className="px-6 py-4 font-mono font-bold text-[#00D4AA]">{a.target}</td>
                      <td className="px-6 py-4">
                         <span className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-widest">
                           {a.method.includes('Push') && <Smartphone className="w-3.5 h-3.5" />}
                           {a.method.includes('Email') && <Mail className="w-3.5 h-3.5" />}
                           {a.method}
                         </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                         <div onClick={() => toggleAlert(i)} className={cn("w-10 h-5 rounded-full relative cursor-pointer transition-colors mx-auto", a.active ? "bg-[#00D4AA]" : "bg-white/10")}>
                            <div className={cn("absolute top-1 w-3 h-3 rounded-full bg-white transition-all shadow-sm", a.active ? "right-1" : "left-1")} />
                         </div>
                      </td>
                      <td className="px-6 py-4">
                         <div className="flex justify-center items-center gap-3">
                            <button className="text-gray-500 hover:text-white transition-colors"><Edit3 className="w-4 h-4" /></button>
                            <button onClick={() => deleteAlert(i)} className="text-gray-500 hover:text-[#FF4D6D] transition-colors"><Trash2 className="w-4 h-4" /></button>
                         </div>
                      </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        </div>

      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0F1928] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#080E19]">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Bell className="w-5 h-5 text-[#00D4AA]" /> Create New Alert
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-5">
              <div className="space-y-2">
                 <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Asset Category</label>
                 <select value={newStock} onChange={(e) => setNewStock(e.target.value)} className="w-full bg-[#060B14] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#00D4AA]/50 font-bold">
                    <option value="RELIANCE.NS">Reliance Industries (RELIANCE)</option>
                    <option value="HDFCBANK.NS">HDFC Bank (HDFCBANK)</option>
                    <option value="TCS.NS">Tata Consultancy (TCS)</option>
                    <option value="INFY.NS">Infosys (INFY)</option>
                 </select>
              </div>

              <div className="space-y-2">
                 <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Trigger Condition</label>
                 <select value={newCond} onChange={(e) => setNewCond(e.target.value)} className="w-full bg-[#060B14] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#00D4AA]/50 font-medium">
                    <option value="Price crosses above">Price crosses above</option>
                    <option value="Price falls below">Price falls below</option>
                    <option value="Volume spike >">Volume spike &gt;</option>
                 </select>
              </div>

              <div className="space-y-2">
                 <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Target Value</label>
                 <input autoFocus type="text" placeholder="e.g. 2900" value={newTarget} onChange={(e) => setNewTarget(e.target.value)} className="w-full bg-[#060B14] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#00D4AA]/50 font-mono" />
              </div>
            </div>

            <div className="p-6 pt-2 flex justify-end gap-3 bg-white/[0.02] border-t border-white/5">
              <button onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl border border-white/10 text-gray-300 font-bold text-sm hover:bg-white/5 transition-colors">Cancel</button>
              <button disabled={!newTarget} onClick={handleCreate} className="px-5 py-2.5 rounded-xl bg-[#00D4AA] text-[#060B14] font-black text-sm hover:bg-[#00D4AA]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Activate Alert</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

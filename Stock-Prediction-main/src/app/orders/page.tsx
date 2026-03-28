"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { SignalBadge } from "@/components/ui/signal-badge";
import { Receipt, History, ListOrdered, CheckCircle2, Clock, X, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export default function OrdersPage() {
  const [tab, setTab] = useState("Open Orders");
  const [orders, setOrders] = useState([
    { sym: "HDFCBANK.NS", type: "BUY", qty: 25, price: 1640.00, status: "PENDING", time: "09:45 AM", class: "LIMIT" },
    { sym: "RELIANCE.NS", type: "SELL", qty: 10, price: 2850.50, status: "EXECUTED", time: "10:15 AM", class: "MARKET" },
    { sym: "INFY.NS", type: "BUY", qty: 50, price: 1450.00, status: "CANCELLED", time: "11:30 AM", class: "LIMIT" },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newOrder, setNewOrder] = useState({ sym: "RELIANCE.NS", type: "BUY", qty: 10, price: 2840, class: "LIMIT" });

  const handlePlaceOrder = () => {
    const formattedTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const orderObj = {
      sym: newOrder.sym,
      type: newOrder.type,
      qty: newOrder.qty,
      price: newOrder.price,
      status: newOrder.class === "MARKET" ? "EXECUTED" : "PENDING",
      time: formattedTime,
      class: newOrder.class
    };
    
    setOrders([orderObj, ...orders]);
    setIsModalOpen(false);
  };

  return (
    <DashboardLayout>
      <div className="w-full max-w-7xl mx-auto pb-10">
        
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-white/5 pb-6">
          <div>
            <h1 className="text-3xl font-black text-white flex items-center gap-3">
               <Receipt className="w-8 h-8 text-[#00D4AA]" /> Order Book
            </h1>
            <p className="text-gray-400 font-medium mt-1">Manage open limits, stop losses, and review historical trade tickets</p>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="bg-[#0F1928] hover:bg-[#1a2536] border border-white/10 text-white font-black px-6 py-2.5 rounded-xl flex items-center gap-2 shadow-sm transition-colors text-sm shrink-0">
            <Plus className="w-4 h-4" /> New Order
          </button>
        </div>

        <div className="glass-card rounded-2xl border border-white/5 flex flex-col items-center justify-center min-h-[500px]">
           <div className="w-full border-b border-white/5 bg-[#080E19]/80 px-6 py-4 flex gap-6">
              {["Open Orders", "Order History", "Trade Ledger"].map(t => (
                <button 
                  key={t}
                  onClick={() => setTab(t)}
                  className={cn(
                    "text-sm font-bold transition-all relative pb-2",
                    tab === t ? "text-[#00D4AA]" : "text-gray-500 hover:text-white"
                  )}
                >
                  {t}
                  {tab === t && <div className="absolute -bottom-[17px] left-0 w-full h-0.5 bg-[#00D4AA] rounded-t-full shadow-[0_0_8px_#00D4AA]"></div>}
                </button>
              ))}
           </div>

           <div className="w-full flex-1 overflow-x-auto p-1">
             <table className="w-full text-sm text-left">
               <thead className="text-[10px] text-gray-500 uppercase tracking-widest bg-white/[0.02] border-b border-white/5 font-bold">
                 <tr>
                    <th className="px-6 py-4">Time</th>
                    <th className="px-6 py-4">Symbol</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4">Product</th>
                    <th className="px-6 py-4 text-right">Qty</th>
                    <th className="px-6 py-4 text-right">Price</th>
                    <th className="px-6 py-4 text-center">Status</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-white/5">
                 {orders.filter(o => tab === "Order History" || (tab === "Open Orders" && o.status === "PENDING") || tab === "Trade Ledger").map((o, i) => (
                   <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4 text-gray-400 font-mono text-xs">{o.time}</td>
                      <td className="px-6 py-4 font-bold text-white">{o.sym.split('.')[0]}</td>
                      <td className="px-6 py-4 font-bold">
                         <span className={cn(o.type === 'BUY' ? "text-[#00D4AA]" : "text-[#FF4D6D]")}>{o.type}</span>
                      </td>
                      <td className="px-6 py-4 text-gray-400 font-bold text-[10px] tracking-widest uppercase">{o.class}</td>
                      <td className="px-6 py-4 text-right font-mono text-white font-bold">{o.qty}</td>
                      <td className="px-6 py-4 text-right font-mono text-gray-300">₹{o.price.toFixed(2)}</td>
                      <td className="px-6 py-4 text-center flex justify-center">
                        {o.status === 'PENDING' && <div className="text-[10px] bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded font-bold border border-amber-500/20 flex items-center gap-1 w-max"><Clock className="w-3 h-3"/> PENDING</div>}
                        {o.status === 'EXECUTED' && <div className="text-[10px] bg-[#00D4AA]/10 text-[#00D4AA] px-2 py-0.5 rounded font-bold border border-[#00D4AA]/20 flex items-center gap-1 w-max"><CheckCircle2 className="w-3 h-3"/> EXECUTED</div>}
                        {o.status === 'CANCELLED' && <div className="text-[10px] bg-white/5 text-gray-400 px-2 py-0.5 rounded font-bold border border-white/10 w-max">CANCELLED</div>}
                      </td>
                   </tr>
                 ))}
                 
                 {tab === 'Trade Ledger' && orders.filter(o => o.status === 'EXECUTED').length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center py-10 opacity-50">
                         <ListOrdered className="w-8 h-8 mx-auto mb-2 text-gray-500" />
                         <p>No trades executed today</p>
                      </td>
                    </tr>
                 )}
                 {tab === 'Open Orders' && orders.filter(o => o.status === 'PENDING').length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center py-10 opacity-50">
                         <ListOrdered className="w-8 h-8 mx-auto mb-2 text-gray-500" />
                         <p>No open orders</p>
                      </td>
                    </tr>
                 )}
               </tbody>
             </table>
           </div>
        </div>

      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0F1928] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col">
            
            <div className="p-5 border-b border-white/5 flex justify-between items-center bg-[#080E19]">
              <h2 className="text-xl font-bold flex items-center gap-2">
                 {newOrder.type === 'BUY' ? <span className="text-[#00D4AA]">Buy Order</span> : <span className="text-[#FF4D6D]">Sell Order</span>}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-5">
              
              <div className="flex bg-[#060B14] p-1 rounded-xl border border-white/10">
                <button onClick={() => setNewOrder({...newOrder, type: 'BUY'})} className={cn("flex-1 py-1.5 rounded-lg text-sm font-bold transition-all", newOrder.type === 'BUY' ? "bg-[#00D4AA]/20 text-[#00D4AA] shadow-sm" : "text-gray-500 hover:text-white")}>BUY</button>
                <button onClick={() => setNewOrder({...newOrder, type: 'SELL'})} className={cn("flex-1 py-1.5 rounded-lg text-sm font-bold transition-all", newOrder.type === 'SELL' ? "bg-[#FF4D6D]/20 text-[#FF4D6D] shadow-sm" : "text-gray-500 hover:text-white")}>SELL</button>
              </div>

              <div className="space-y-2">
                 <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Stock Symbol</label>
                 <select value={newOrder.sym} onChange={(e) => setNewOrder({...newOrder, sym: e.target.value})} className="w-full bg-[#060B14] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-white/30 font-bold">
                    <option value="RELIANCE.NS">RELIANCE</option>
                    <option value="HDFCBANK.NS">HDFCBANK</option>
                    <option value="TCS.NS">TCS</option>
                    <option value="INFY.NS">INFY</option>
                 </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                   <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Quantity</label>
                   <input type="number" min="1" value={newOrder.qty} onChange={(e) => setNewOrder({...newOrder, qty: Number(e.target.value)})} className="w-full bg-[#060B14] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-white/30 font-mono" />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Price</label>
                   <input type="number" step="0.5" disabled={newOrder.class === 'MARKET'} value={newOrder.price} onChange={(e) => setNewOrder({...newOrder, price: Number(e.target.value)})} className="w-full bg-[#060B14] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-white/30 font-mono disabled:opacity-50" />
                </div>
              </div>

              <div className="flex bg-[#060B14] p-1 rounded-xl border border-white/10">
                <button onClick={() => setNewOrder({...newOrder, class: 'LIMIT'})} className={cn("flex-1 py-1.5 rounded-lg text-[10px] tracking-wider uppercase font-bold transition-all", newOrder.class === 'LIMIT' ? "bg-white/10 text-white" : "text-gray-600 hover:text-white")}>LIMIT</button>
                <button onClick={() => setNewOrder({...newOrder, class: 'MARKET'})} className={cn("flex-1 py-1.5 rounded-lg text-[10px] tracking-wider uppercase font-bold transition-all", newOrder.class === 'MARKET' ? "bg-white/10 text-white" : "text-gray-600 hover:text-white")}>MARKET</button>
              </div>
            </div>

            <div className="p-6 pt-2 flex justify-between items-center bg-white/[0.02] border-t border-white/5">
              <div className="text-gray-400 font-medium text-xs">Margin Reqd: <span className="font-mono text-white">₹{(newOrder.price * newOrder.qty * 0.2).toFixed(2)}</span></div>
              <button onClick={handlePlaceOrder} className={cn(
                "px-6 py-2.5 rounded-xl font-black text-sm text-[#060B14] transition-colors shadow-lg",
                newOrder.type === 'BUY' ? "bg-[#00D4AA] hover:bg-[#00D4AA]/90 shadow-[0_0_15px_rgba(0,212,170,0.3)]" : "bg-[#FF4D6D] hover:bg-[#FF4D6D]/90 shadow-[0_0_15px_rgba(255,77,109,0.3)]"
              )}>
                {newOrder.type === 'BUY' ? `Buy ${newOrder.qty}` : `Sell ${newOrder.qty}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

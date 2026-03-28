"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, BarChart2, TrendingUp, Zap, History, Layers, PieChart, Star, Receipt, Bell, Settings, HelpCircle,
  LucideIcon
} from "lucide-react";
import { useUser } from "@/firebase/auth/use-user";
import { useEffect, useState } from "react";
import { usePortfolioData } from "@/lib/market-simulator";

type NavItem = {
  name: string;
  href: string;
  icon: LucideIcon;
  badge?: number;
  authRequired?: boolean;
};

type NavGroup = {
  title: string;
  items: NavItem[];
};

const NAV_GROUPS: NavGroup[] = [
  {
    title: "OVERVIEW",
    items: [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { name: "Market Overview", href: "/market-data", icon: BarChart2 },
    ]
  },
  {
    title: "TRADING",
    items: [
      { name: "Market Data", href: "/market-data", icon: TrendingUp },
      { name: "Signal Engine", href: "/signal-engine", icon: Zap },
      { name: "Backtesting", href: "/backtesting", icon: History },
    ]
  },
  {
    title: "PORTFOLIO",
    items: [
      { name: "Portfolio Analytics", href: "/portfolio-analytics", icon: PieChart },
      { name: "Watchlist", href: "/watchlist", icon: Star },
      { name: "Orders & Trades", href: "/orders", icon: Receipt },
    ]
  },
  {
    title: "TOOLS",
    items: [
      { name: "Alerts", href: "/alerts", icon: Bell, badge: 3 },
    ]
  },
  {
    title: "ACCOUNT",
    items: [
      { name: "Settings", href: "/settings", icon: Settings },
      { name: "Help & Docs", href: "/help", icon: HelpCircle },
    ]
  }
];

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useUser();
  const { dailyPnlPercent, dailyPnl } = usePortfolioData();
  const [time, setTime] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour12: true }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const isPositive = dailyPnl >= 0;

  return (
    <aside className="w-[240px] flex-shrink-0 flex flex-col h-screen bg-[#080E19] border-r border-white/5 overflow-hidden font-sans z-50 transition-all duration-300">
      <div className="p-5 border-b border-white/5">
        <div className="flex items-center gap-2 mb-6 cursor-pointer">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-[#00D4AA] to-blue-600 flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(0,212,170,0.4)]">
            Q
          </div>
          <span className="font-bold text-xl tracking-tight text-white">QuantAxis <span className="text-[#00D4AA]">Pro</span></span>
        </div>

        <div className="flex items-center gap-3 p-3 bg-[#0F1928] rounded-xl border border-white/5 hover:border-white/10 transition-colors cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-[#00D4AA] font-bold border border-[#00D4AA]/30">
            A
          </div>
          <div>
            <div className="text-sm font-bold text-white leading-none">Admin</div>
            <div className="text-[10px] text-[#00D4AA] font-bold mt-1 uppercase tracking-wider bg-[#00D4AA]/10 inline-block px-1.5 py-0.5 rounded">Pro Member</div>
          </div>
        </div>

        <div className="mt-4 p-3.5 bg-[#0F1928]/50 rounded-xl border border-white/5 relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-16 h-16 bg-[#00D4AA] rounded-full blur-[40px] opacity-20 pointer-events-none"></div>
          <div className="text-xs text-gray-500 font-bold mb-1 uppercase tracking-wider">Today's P&L</div>
          <div className={cn("text-xl font-bold font-mono tracking-tight", isPositive ? "text-[#00D4AA]" : "text-[#FF4D6D]")}>
            {isPositive ? '+' : '-'}₹{Math.abs(dailyPnl).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            <span className="text-sm ml-1 opacity-80">({isPositive ? '+' : ''}{dailyPnlPercent.toFixed(2)}%)</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-4 scrollbar-hide">
        {NAV_GROUPS.map((group, idx) => (
          <div key={idx} className="mb-6 px-3">
            <h4 className="px-3 text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-widest">{group.title}</h4>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
                return (
                  <Link 
                    key={item.href} 
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative",
                      isActive 
                        ? "text-[#00D4AA] bg-[#00D4AA]/10" 
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    )}
                  >
                    {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-[#00D4AA] rounded-r-full shadow-[0_0_8px_#00D4AA]" />}
                    
                    <item.icon size={18} className={cn("shrink-0", isActive ? "text-[#00D4AA]" : "text-gray-500 group-hover:text-gray-300")} />
                    {item.name}
                    
                    {item.badge && (
                      <span className="ml-auto bg-[#FF4D6D] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-4 text-center shadow-[0_0_8px_rgba(255,77,109,0.5)]">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-white/5 bg-[#060B14]">
        <div className="flex items-center justify-between text-xs font-medium bg-[#0F1928] p-2.5 rounded-lg border border-white/5">
          <Link href="/alerts" className="relative p-2 text-gray-400 hover:text-white transition-all duration-200 hover:bg-white/5 rounded-full active:scale-95">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF4D6D] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FF4D6D] border-2 border-[#080E19]"></span>
            </span>
          </Link>
          <div className="text-gray-400 font-mono tracking-tight font-bold">
            {time || "--:--:--"}
          </div>
        </div>
        
        <div className="mt-3 p-3 rounded-lg bg-gradient-to-r from-blue-900/10 to-[#00D4AA]/5 border border-[#00D4AA]/20 text-center cursor-pointer hover:border-[#00D4AA]/50 hover:bg-[#00D4AA]/10 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          <p className="text-xs font-bold text-[#00D4AA] tracking-wide relative z-10">Upgrade to Institutional ⚡</p>
        </div>
      </div>
    </aside>
  );
}

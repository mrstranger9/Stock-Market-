"use client";

import { TickerTape } from "./ticker-tape";
import { Search, Bell, ChevronDown, User } from "lucide-react";
import { usePathname } from "next/navigation";
import { useUser } from "@/firebase/auth/use-user";
import Link from 'next/link';

export function Header() {
  const pathname = usePathname();
  const { user } = useUser();
  
  const pathNameText = pathname === '/' 
    ? 'Dashboard / Overview' 
    : pathname?.replace(/^\//, '').split('/').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' / ');

  return (
    <div className="flex flex-col w-full z-40 bg-[#060B14] shadow-md relative">
      <div className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-[#080E19]">
        {/* Left: Breadcrumbs */}
        <div className="flex items-center text-sm font-medium text-gray-500 gap-2">
          <span className="cursor-pointer hover:text-white transition-colors">QuantAxis Pro</span>
          <span className="text-gray-700">/</span>
          <span className="text-white font-bold">{pathNameText || 'Overview'}</span>
        </div>

        {/* Right: Actions & User */}
        <div className="flex items-center gap-6">
          {/* Indices Badges */}
          <div className="hidden lg:flex items-center gap-5 border-r border-white/10 pr-6">
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-0.5">NIFTY 50</span>
              <div className="flex gap-2 items-center text-sm font-mono font-bold text-white">
                22,450.00 <span className="text-[#00D4AA] bg-[#00D4AA]/10 px-1 rounded text-[10px]">+0.43%</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-0.5">SENSEX</span>
              <div className="flex gap-2 items-center text-sm font-mono font-bold text-white">
                73,820.00 <span className="text-[#00D4AA] bg-[#00D4AA]/10 px-1 rounded text-[10px]">+0.38%</span>
              </div>
            </div>
          </div>

          <div className="relative group hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 group-focus-within:text-[#00D4AA] transition-colors" />
            <input 
              type="text" 
              placeholder="Search stocks, indices..." 
              className="bg-[#0F1928] border border-white/10 text-sm text-white font-medium rounded-lg pl-9 pr-12 py-1.5 focus:outline-none focus:border-[#00D4AA]/50 focus:ring-1 focus:ring-[#00D4AA]/50 w-64 md:w-80 transition-all placeholder:text-gray-600"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <kbd className="bg-white/5 border border-white/10 text-gray-400 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold shadow-sm">⌘K</kbd>
            </div>
          </div>

          <Link href="/alerts" className="relative p-2 text-gray-400 hover:text-white transition-all duration-200 hover:bg-white/5 rounded-full active:scale-95">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF4D6D] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FF4D6D] border-2 border-[#080E19]"></span>
            </span>
          </Link>

          <div className="relative group">
            <button className="flex items-center gap-2 pl-2 md:border-l border-white/10 text-gray-400 hover:text-white transition-colors group relative peer">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-800 to-slate-700 border border-white/10 flex items-center justify-center overflow-hidden shadow-inner group-hover:border-white/30 transition-colors">
                 <User className="w-4 h-4 text-gray-300" />
              </div>
               <span className="hidden md:block font-bold text-sm text-gray-200">Admin</span>
              <ChevronDown className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
            </button>
            <div className="absolute right-0 top-full mt-2 w-48 bg-[#0F1928] border border-white/10 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pt-2 pb-2">
              <div className="px-4 py-2 border-b border-white/5 mb-2">
                 <p className="text-xs text-gray-400 font-bold uppercase">Signed in as</p>
                 <p className="text-sm text-white font-bold truncate">admin@quantaxis.com</p>
              </div>
              <Link href="/settings" className="block px-4 py-2 hover:bg-white/5 text-gray-300 hover:text-white transition-colors text-sm font-medium">Account Settings</Link>
              <Link href="/docs" className="block px-4 py-2 hover:bg-white/5 text-gray-300 hover:text-white transition-colors text-sm font-medium">Help & Support</Link>
              <div className="border-t border-white/5 my-2"></div>
              <Link href="/login" className="block px-4 py-2 hover:bg-red-500/10 text-red-400 hover:text-red-300 transition-colors text-sm font-bold">Sign Out</Link>
            </div>
          </div>
        </div>
      </div>

      <TickerTape />
    </div>
  );
}

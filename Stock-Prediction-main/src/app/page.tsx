"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, CheckCircle2 } from 'lucide-react';
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate auth
    setTimeout(() => {
      setIsLoading(false);
      // Ensure redirect is aware of the GitHub Pages subpath
      window.location.href = '/Stock_Market/dashboard/';
    }, 1500);
  };

  return (
    <div className="min-h-screen flex bg-[#060B14] text-white overflow-hidden relative font-sans">
      
      {/* Animated CSS Nodes Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-[#00D4AA]/10"
            style={{
              width: Math.random() * 4 + 2 + 'px',
              height: Math.random() * 4 + 2 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              animation: `float ${Math.random() * 10 + 10}s linear infinite`,
              opacity: Math.random() * 0.5 + 0.1
            }}
          />
        ))}
        {/* CSS definition for float animation injected below but typically in globals */}
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes float {
            0% { transform: translateY(0px) translateX(0px); opacity: 0; }
            50% { opacity: 1; }
            100% { transform: translateY(-1000px) translateX(200px); opacity: 0; }
          }
        `}} />
      </div>

      {/* LEFT SIDE - Branding & Animation */}
      <div className="hidden lg:flex flex-col justify-center w-1/2 p-12 relative z-10 border-r border-white/5 bg-gradient-to-br from-[#060B14] to-[#080E19]">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
        
        <div className="max-w-xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00D4AA] to-blue-600 flex items-center justify-center font-bold text-2xl text-white shadow-[0_0_30px_rgba(0,212,170,0.5)]">
                Q
              </div>
              <h1 className="text-4xl font-black tracking-tight text-white">
                QuantAxis <span className="text-[#00D4AA]">Pro</span>
              </h1>
            </div>
            
            <h2 className="text-5xl font-extrabold leading-tight mb-6 bg-gradient-to-r from-white via-white to-gray-400 bg-clip-text text-transparent">
              Institutional Grade <br />
              <span className="text-[#00D4AA]">Trading Terminal.</span>
            </h2>
            <p className="text-xl text-gray-400 font-medium">
              Advanced execution, real-time analytics, and AI-driven market intelligence for Indian equities.
            </p>
          </motion.div>

          {/* Animated Candlestick Preview */}
          <div className="bg-[#0F1928] rounded-2xl p-6 border border-white/10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#00D4AA] opacity-5 blur-[100px] rounded-full"></div>
            
            <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-white font-bold text-xl">RELIANCE.NS</span>
                  <span className="bg-[#00D4AA]/20 text-[#00D4AA] text-[10px] font-bold px-2 py-0.5 rounded">AI SIGNAL: BUY</span>
                </div>
                <div className="text-sm font-mono text-gray-400 mt-1">NSE Equity</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold font-mono text-[#00D4AA]">₹2,847.50</div>
                <div className="text-sm font-bold text-[#00D4AA]">+1.24%</div>
              </div>
            </div>

            <div className="h-32 flex items-end gap-2 justify-between">
              {[40, 60, 45, 75, 55, 80, 70, 95, 85, 110, 100, 120].map((h, i) => (
                <motion.div 
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ duration: 1, delay: i * 0.1, ease: "easeOut" }}
                  className={cn(
                    "w-full rounded-t-sm relative",
                    i % 3 === 0 ? "bg-[#FF4D6D]" : "bg-[#00D4AA]"
                  )}
                >
                  <div className={cn("absolute top-[-10px] left-1/2 -ml-[1px] w-[2px] h-[120%] opacity-40", i % 3 === 0 ? "bg-[#FF4D6D]" : "bg-[#00D4AA]")}></div>
                </motion.div>
              ))}
            </div>
          </div>
          
          <div className="mt-8 flex gap-6 text-sm text-gray-500 font-medium">
             <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#00D4AA]" /> SEBI Compliant</div>
             <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#00D4AA]" /> 256-bit Encryption</div>
             <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#00D4AA]" /> Genkit AI Powered</div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative z-10">
        
        {/* Ambient glows */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full"></div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md glass p-8 sm:p-10 rounded-3xl"
        >
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <div className="w-10 h-10 rounded-xl bg-[#00D4AA] flex items-center justify-center font-bold text-xl text-[#060B14]">Q</div>
            <span className="font-bold text-2xl tracking-tight text-white">QuantAxis Pro</span>
          </div>

          <h2 className="text-3xl font-bold mb-2 text-white">Welcome back</h2>
          <p className="text-gray-400 font-medium mb-8">Enter your credentials to access the terminal.</p>
          
          <button className="w-full flex items-center justify-center gap-3 bg-white text-black font-bold py-3.5 px-4 rounded-xl hover:bg-gray-100 transition-colors mb-6 shadow-lg">
            <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Continue with Google
          </button>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px bg-white/10 flex-1"></div>
            <span className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Or email</span>
            <div className="h-px bg-white/10 flex-1"></div>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-300 ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-[#00D4AA] transition-colors" />
                <input 
                  type="email" 
                  placeholder="name@company.com"
                  className={cn(
                    "w-full bg-[#060B14]/50 border rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 transition-all",
                    error ? "border-[#FF4D6D] focus:ring-[#FF4D6D]/50 focus:border-[#FF4D6D]" : "border-white/10 focus:border-[#00D4AA]/50 focus:ring-[#00D4AA]/50"
                  )}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-bold text-gray-300">Password</label>
                <Link href="#" className="text-sm font-bold text-[#00D4AA] hover:text-[#00D4AA]/80 transition-colors">Forgot?</Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-[#00D4AA] transition-colors" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••"
                  className={cn(
                    "w-full bg-[#060B14]/50 border rounded-xl py-3.5 pl-12 pr-12 text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 transition-all",
                    error ? "border-[#FF4D6D] focus:ring-[#FF4D6D]/50 focus:border-[#FF4D6D]" : "border-white/10 focus:border-[#00D4AA]/50 focus:ring-[#00D4AA]/50"
                  )}
                  required
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {error && <p className="text-[#FF4D6D] text-xs font-bold mt-1.5 ml-1">{error}</p>}
            </div>

            <div className="flex items-center gap-2 pt-1 pb-2">
              <input type="checkbox" id="remember" className="rounded bg-[#060B14] border-white/20 text-[#00D4AA] focus:ring-[#00D4AA]/30 w-4 h-4" />
              <label htmlFor="remember" className="text-sm font-medium text-gray-400 cursor-pointer">Remember this device</label>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-[#00D4AA] hover:bg-[#00D4AA]/90 text-[#060B14] font-black text-lg py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(0,212,170,0.3)] hover:shadow-[0_0_25px_rgba(0,212,170,0.5)] flex justify-center items-center"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-[#060B14]/30 border-t-[#060B14] rounded-full animate-spin"></div>
              ) : "Login to Terminal"}
            </button>
          </form>

          <p className="mt-8 text-center text-gray-400 font-medium text-sm">
            Don't have an account? <Link href="/register" className="text-white font-bold hover:text-[#00D4AA] transition-colors underline decoration-white/30 underline-offset-4 hover:decoration-[#00D4AA]">Apply for access</Link>
          </p>
          
          <p className="mt-8 text-center text-xs text-gray-600 font-medium">
            By signing in, you agree to SEBI guidelines & our Terms of Service.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

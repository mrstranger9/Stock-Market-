"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, CheckCircle2, User, Phone, CreditCard } from 'lucide-react';
import { cn } from "@/lib/utils";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      window.location.href = '/login';
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
              Open your <br />
              <span className="text-[#00D4AA]">Institutional Account.</span>
            </h2>
            <p className="text-xl text-gray-400 font-medium">
              Join elite traders accessing low-latency data and AI-driven insights. Application takes &lt; 2 minutes.
            </p>
          </motion.div>

          <div className="mt-8 flex flex-col gap-4 text-sm text-gray-400 font-medium bg-[#0F1928] p-6 rounded-2xl border border-white/5">
             <div className="flex items-start gap-3">
               <div className="w-6 h-6 rounded-full bg-[#00D4AA]/20 flex items-center justify-center shrink-0 mt-0.5"><CheckCircle2 className="w-4 h-4 text-[#00D4AA]" /></div>
               <div>
                  <span className="text-white font-bold block mb-0.5">Automated KYC</span>
                  Zero paperwork. Fetch details securely via PAN & DigiLocker.
               </div>
             </div>
             <div className="flex items-start gap-3">
               <div className="w-6 h-6 rounded-full bg-[#00D4AA]/20 flex items-center justify-center shrink-0 mt-0.5"><CheckCircle2 className="w-4 h-4 text-[#00D4AA]" /></div>
               <div>
                  <span className="text-white font-bold block mb-0.5">Lowest Brokerage Tier</span>
                  Flat ₹20 per executed order across all segments.
               </div>
             </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 relative z-10 overflow-y-auto hide-scrollbar">
        
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full"></div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md glass p-6 sm:p-10 rounded-3xl"
        >
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <div className="w-10 h-10 rounded-xl bg-[#00D4AA] flex items-center justify-center font-bold text-xl text-[#060B14]">Q</div>
            <span className="font-bold text-2xl tracking-tight text-white">QuantAxis Pro</span>
          </div>

          <h2 className="text-3xl font-bold mb-2 text-white">Apply for Access</h2>
          <p className="text-gray-400 font-medium mb-8">Ready to execute at the speed of thought?</p>

          <form onSubmit={handleRegister} className="space-y-4">
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 ml-1 uppercase tracking-widest">Full Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-[#00D4AA] transition-colors" />
                <input 
                  type="text" 
                  placeholder="As per PAN card"
                  className="w-full bg-[#060B14]/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-[#00D4AA]/50 focus:ring-1 focus:ring-[#00D4AA]/50 transition-all"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 ml-1 uppercase tracking-widest">Mobile</label>
                <div className="relative group">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-[#00D4AA] transition-colors" />
                    <input 
                    type="tel" 
                    placeholder="10 digits"
                    className="w-full bg-[#060B14]/50 border border-white/10 rounded-xl py-3 pl-9 pr-3 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-[#00D4AA]/50 focus:ring-1 focus:ring-[#00D4AA]/50 transition-all font-mono"
                    required
                    />
                </div>
                </div>

                <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 ml-1 uppercase tracking-widest">PAN Number</label>
                <div className="relative group">
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-[#00D4AA] transition-colors" />
                    <input 
                    type="text" 
                    placeholder="ABCDE1234F"
                    className="w-full bg-[#060B14]/50 border border-white/10 rounded-xl py-3 pl-9 pr-3 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-[#00D4AA]/50 focus:ring-1 focus:ring-[#00D4AA]/50 transition-all font-mono uppercase"
                    required
                    />
                </div>
                </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 ml-1 uppercase tracking-widest">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-[#00D4AA] transition-colors" />
                <input 
                  type="email" 
                  placeholder="name@company.com"
                  className="w-full bg-[#060B14]/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-[#00D4AA]/50 focus:ring-1 focus:ring-[#00D4AA]/50 transition-all"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 ml-1 uppercase tracking-widest">Create Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-[#00D4AA] transition-colors" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••"
                  className="w-full bg-[#060B14]/50 border border-white/10 rounded-xl py-3 pl-10 pr-10 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-[#00D4AA]/50 focus:ring-1 focus:ring-[#00D4AA]/50 transition-all"
                  required
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full mt-6 bg-[#00D4AA] hover:bg-[#00D4AA]/90 text-[#060B14] font-black text-lg py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(0,212,170,0.3)] hover:shadow-[0_0_25px_rgba(0,212,170,0.5)] flex justify-center items-center"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-[#060B14]/30 border-t-[#060B14] rounded-full animate-spin"></div>
              ) : "Create Account"}
            </button>
          </form>

          <p className="mt-8 text-center text-gray-400 font-medium text-sm">
            Already have an account? <Link href="/login" className="text-white font-bold hover:text-[#00D4AA] transition-colors underline decoration-white/30 underline-offset-4 hover:decoration-[#00D4AA]">Sign In</Link>
          </p>
          
          <p className="mt-6 text-center text-xs text-gray-600 font-medium leading-relaxed">
            By creating an account, you agree to comply with SEBI, NSE, and BSE guidelines & our Terms of Service.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function PriceTag({ 
  value, 
  prev, 
  currency = "₹", 
  className 
}: { 
  value: number; 
  prev?: number; 
  currency?: string; 
  className?: string; 
}) {
  const [flashClass, setFlashClass] = useState("");

  useEffect(() => {
    if (prev && value !== prev) {
      if (value > prev) {
        setFlashClass("animate-flash-green");
      } else if (value < prev) {
        setFlashClass("animate-flash-red");
      }
      const timer = setTimeout(() => setFlashClass(""), 800);
      return () => clearTimeout(timer);
    }
  }, [value, prev]);

  return (
    <span className={cn("font-mono font-bold tracking-tight rounded px-1 transition-colors duration-300", flashClass, className)}>
      {currency}{value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
    </span>
  );
}

import { cn } from "@/lib/utils";

export function ChangeBadge({ 
  value, 
  className 
}: { 
  value: number; 
  className?: string; 
}) {
  const isPositive = value >= 0;
  
  return (
    <span className={cn("inline-flex items-center font-mono text-xs font-bold px-1.5 py-0.5 rounded",
      isPositive ? "text-[#00D4AA] bg-[#00D4AA]/10" : "text-[#FF4D6D] bg-[#FF4D6D]/10",
      className
    )}>
      {isPositive ? "+" : ""}{value.toFixed(2)}% {isPositive ? "▲" : "▼"}
    </span>
  );
}

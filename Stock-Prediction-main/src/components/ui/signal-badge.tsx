import { cn } from "@/lib/utils";

export function SignalBadge({ 
  type, 
  confidence, 
  className 
}: { 
  type: 'BUY' | 'SELL' | 'HOLD'; 
  confidence?: number; 
  className?: string; 
}) {
  const colorMap = {
    BUY: "bg-[#00D4AA]/10 text-[#00D4AA] border-[#00D4AA]/30",
    SELL: "bg-[#FF4D6D]/10 text-[#FF4D6D] border-[#FF4D6D]/30",
    HOLD: "bg-blue-500/10 text-blue-400 border-blue-500/30"
  };

  const isHighConf = confidence !== undefined && confidence >= 90;

  return (
    <div className={cn("inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-xs font-bold uppercase tracking-wider", colorMap[type], className)}>
      <span className="relative flex h-2 w-2">
        {isHighConf && <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", type === 'BUY' ? 'bg-[#00D4AA]' : type === 'SELL' ? 'bg-[#FF4D6D]' : 'bg-blue-500')}></span>}
        <span className={cn("relative inline-flex rounded-full h-2 w-2", type === 'BUY' ? 'bg-[#00D4AA]' : type === 'SELL' ? 'bg-[#FF4D6D]' : 'bg-blue-500')}></span>
      </span>
      {type} {confidence !== undefined && <span className="opacity-80 font-mono ml-0.5">{confidence}%</span>}
    </div>
  );
}

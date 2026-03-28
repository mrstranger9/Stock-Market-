'use client';
import { TrendingUp, TrendingDown, Wifi, WifiOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import
  const { stocks, loading, error } = useStocks();

  if (loading) {
    return (
      <div className="relative w-full overflow-hidden whitespace-nowrap bg-card border-y border-border h-[52px] flex items-center px-4">
        <span className="text-xs text-muted-foreground animate-pulse">Loading live NSE market data…</span>
      </div>
    );
  }

  const duplicated = [...stocks, ...stocks];

  return (
    <div className="relative w-full overflow-hidden whitespace-nowrap bg-card border-y border-border group">
      {/* Live / offline badge */}
      <div className="absolute right-2 top-1/2 -translate-y-1/2 z-10 flex items-center gap-1 text-xs bg-card px-2 py-0.5 rounded-full border border-border">
        {error
          ? <><WifiOff className="h-3 w-3 text-chart-2" /><span className="text-chart-2 hidden sm:inline">Offline</span></>
          : <><Wifi className="h-3 w-3 text-chart-1 animate-pulse" /><span className="text-chart-1 hidden sm:inline">Live · NSE</span></>
        }
      </div>

      <div className="flex animate-marquee group-hover:[animation-play-state:paused]">
        {duplicated.map((stock, index) => {
          const isUp = stock.change >= 0;
          const changeStr = isUp ? `+${stock.change.toFixed(2)}` : stock.change.toFixed(2);
          const pctStr   = isUp ? `+${stock.changePercent.toFixed(2)}%` : `${stock.changePercent.toFixed(2)}%`;
          return (
            <div key={index} className="flex-shrink-0 w-52 p-2 border-r border-border">
              <div className="flex items-baseline gap-2">
                <p className="font-bold text-md">{displaySymbol(stock.symbol)}</p>
                <p className={cn('font-semibold', isUp ? 'text-chart-1' : 'text-chart-2')}>
                  ₹{stock.price.toFixed(2)}
                </p>
              </div>
              <div className="flex items-center gap-1 text-xs">
                {isUp
                  ? <TrendingUp className="h-3 w-3 text-chart-1" />
                  : <TrendingDown className="h-3 w-3 text-chart-2" />}
                <span className={cn(isUp ? 'text-chart-1' : 'text-chart-2')}>
                  {changeStr} ({pctStr})
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
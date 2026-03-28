import { Link } from 'react-router-dom';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

export default function StockCard({ stock }) {
  const isPositive = stock.percentChange >= 0;
  
  return (
    <Link to={`/stock/${stock.symbol}`} className="block transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
      <div className="bg-darkCard rounded-2xl p-6 border border-darkBorder hover:border-brandGreen/30 transition-colors h-full flex flex-col justify-between group relative overflow-hidden">
        
        {/* Subtle glow effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-brandGreen/0 to-brandGreen/0 group-hover:from-brandGreen/5 group-hover:to-transparent transition-all duration-500 rounded-2xl pointer-events-none"></div>

        <div className="flex justify-between items-start mb-6 align-top">
          <div>
            <h3 className="text-xl font-bold text-white mb-1 tracking-tight">{stock.symbol.replace('.NS', '')}</h3>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">NSE</p>
          </div>
          <div className={`p-2.5 rounded-xl transition-colors ${isPositive ? 'bg-brandGreen/10 text-brandGreen group-hover:bg-brandGreen/20' : 'bg-brandRed/10 text-brandRed group-hover:bg-brandRed/20'}`}>
            {isPositive ? <TrendingUp size={22} strokeWidth={2.5} /> : <TrendingDown size={22} strokeWidth={2.5} />}
          </div>
        </div>
        
        <div className="mt-auto">
          <div className="text-3xl font-bold tracking-tight mb-2 text-white">
            ₹{stock.currentPrice?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '---'}
          </div>
          
          <div className="flex justify-between items-center text-sm">
            <span className={`font-semibold flex items-center px-2 py-1 rounded-md ${isPositive ? 'bg-brandGreen/10 text-brandGreen' : 'bg-brandRed/10 text-brandRed'}`}>
              {isPositive ? '+' : ''}{stock.percentChange?.toFixed(2)}%
            </span>
            <span className="text-gray-400 flex items-center gap-1.5 font-medium">
              <Activity size={14} className="opacity-70" /> 
              {stock.volume ? (stock.volume / 100000).toFixed(1) + 'L' : '---'} Vol
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

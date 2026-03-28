import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchStocks, createWebSocket } from '../services/api';
import StockCard from '../components/StockCard';
import { Activity } from 'lucide-react';

export default function Dashboard() {
  const [liveStocks, setLiveStocks] = useState([]);
  
  const { data: initialStocks, isLoading, isError } = useQuery({
    queryKey: ['stocks'],
    queryFn: fetchStocks,
  });

  useEffect(() => {
    if (initialStocks && liveStocks.length === 0) {
      setLiveStocks(initialStocks);
    }
  }, [initialStocks]);

  useEffect(() => {
    const ws = createWebSocket((msg) => {
      if (msg.type === 'init' || msg.type === 'update') {
        if (msg.data && msg.data.length > 0) {
          setLiveStocks(msg.data);
        }
      }
    });

    return () => {
      ws.close();
    };
  }, []);

  if (isLoading && liveStocks.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-darkCard rounded-2xl h-44 w-full border border-darkBorder"></div>
        ))}
      </div>
    );
  }

  if (isError) {
    return <div className="text-brandRed text-center mt-12 p-8 bg-brandRed/10 rounded-2xl border border-brandRed/20 max-w-2xl mx-auto flex flex-col items-center gap-4">
      <Activity size={48} className="text-brandRed opacity-50" />
      <span className="text-lg font-medium">Backend Server Unreachable</span>
      <p className="text-brandRed/70 text-sm">Please ensure the FastAPI backend is running on port 8000.</p>
    </div>;
  }

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-end border-b border-darkBorder pb-6 gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-2 text-white">Market Overview</h2>
          <p className="text-gray-400 font-medium">Real-time tracker for NIFTY 50 top constituents</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
        {liveStocks.map((stock) => (
          <StockCard key={stock.symbol} stock={stock} />
        ))}
      </div>
    </div>
  );
}

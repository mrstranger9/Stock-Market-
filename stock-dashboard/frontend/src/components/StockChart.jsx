import { ResponsiveContainer, ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export default function StockChart({ data, period }) {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      // Find the object with open, close etc (assuming it's passing through)
      const dataPoint = payload[0].payload;
      return (
        <div className="bg-darkCard/95 backdrop-blur-md border border-darkBorder p-5 rounded-xl shadow-2xl">
          <p className="text-gray-300 font-medium mb-3 pb-2 border-b border-darkBorder">{label}</p>
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
            <div className="flex justify-between items-center"><span className="text-gray-400">Open</span> <span className="font-semibold ml-2">₹{dataPoint.open.toFixed(2)}</span></div>
            <div className="flex justify-between items-center"><span className="text-gray-400">Close</span> <span className="font-semibold text-blue-400 ml-2">₹{dataPoint.close.toFixed(2)}</span></div>
            <div className="flex justify-between items-center"><span className="text-gray-400">High</span> <span className="font-semibold text-brandGreen ml-2">₹{dataPoint.high.toFixed(2)}</span></div>
            <div className="flex justify-between items-center"><span className="text-gray-400">Low</span> <span className="font-semibold text-brandRed ml-2">₹{dataPoint.low.toFixed(2)}</span></div>
            <div className="col-span-2 flex justify-between items-center mt-1 pt-2 border-t border-darkBorder border-dashed">
              <span className="text-gray-400">Volume</span> <span className="font-semibold">{(dataPoint.volume / 1000).toLocaleString('en-IN', { maximumFractionDigits: 1 })}K</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  if (!data || data.length === 0) {
    return <div className="h-[400px] flex items-center justify-center text-gray-500 bg-darkCard/30 rounded-2xl border border-darkBorder border-dashed">No chart data available for this period.</div>;
  }

  const minPrice = Math.min(...data.map(d => d.low)) * 0.99;
  const maxPrice = Math.max(...data.map(d => d.high)) * 1.01;

  return (
    <div className="h-[450px] w-full bg-darkCard/40 border border-darkBorder rounded-2xl p-6 pt-8">
      <ResponsiveContainer width="100%" height="80%">
        <ComposedChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis 
            dataKey="date" 
            stroke="#475569" 
            tick={{ fill: '#64748b', fontSize: 12 }} 
            tickFormatter={(val) => period === '1d' ? val.split(' ')[1].slice(0, 5) : val}
            minTickGap={40}
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            domain={[minPrice, maxPrice]} 
            stroke="#475569" 
            tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
            tickFormatter={(val) => `₹${val.toFixed(0)}`}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#334155', strokeWidth: 1, strokeDasharray: '4 4' }} />
          <Legend wrapperStyle={{ paddingTop: "20px" }} iconType="circle" />
          <Line type="monotone" dataKey="close" stroke="#3b82f6" strokeWidth={3} dot={false} activeDot={{ r: 6, fill: "#3b82f6", stroke: "#0f172a", strokeWidth: 3 }} name="Close Price" />
        </ComposedChart>
      </ResponsiveContainer>
      
      {/* Volume Chart at bottom */}
      <div className="h-[20%] w-full mt-4 opacity-60">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
             <XAxis dataKey="date" hide />
             <YAxis dataKey="volume" hide domain={[0, 'auto']} />
             <Bar dataKey="volume" fill="#334155" radius={[4, 4, 0, 0]} name="Volume" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

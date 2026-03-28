import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import StockDetail from './pages/StockDetail';

function App() {
  return (
    <div className="min-h-screen bg-darkBg text-white font-sans">
      <nav className="border-b border-darkBorder bg-darkCard/80 backdrop-blur-md p-4 sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <h1 
            className="text-2xl font-bold bg-gradient-to-r from-brandGreen to-teal-400 bg-clip-text text-transparent cursor-pointer" 
            onClick={() => window.location.href='/'}
          >
            India Stock Dashboard
          </h1>
          <div className="flex items-center space-x-2 bg-darkBg/50 px-3 py-1.5 rounded-full border border-darkBorder">
            <span className="h-2 w-2 rounded-full bg-brandGreen animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
            <span className="text-sm font-medium text-gray-300">Market Open (Mock)</span>
          </div>
        </div>
      </nav>
      
      <main className="container mx-auto p-4 md:p-6 lg:p-8">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/stock/:symbol" element={<StockDetail />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;

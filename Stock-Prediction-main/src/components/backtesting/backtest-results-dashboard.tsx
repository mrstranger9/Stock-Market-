'use client';
import { BacktestResultMetricCard } from "./backtest-result-metric-card";
import { ArrowDown, ArrowUp, Briefcase, Calculator, CircleDollarSign, Percent, Scale, Target, ShieldCheck, AreaChart, ArrowRightLeft, ChevronsDown } from "lucide-react";

interface BacktestResults {
    totalReturn: number;
    finalPortfolioValue: number;
    winRate: number;
    profitFactor: number;
    sharpeRatio: number;
    sortinoRatio: number;
    calmarRatio: number;
    maxDrawdown: number;
    totalTrades: number;
    avgTradeReturn: number;
    maxConsecutiveLosses: number;
    initialCapital: number;
}

interface BacktestResultsDashboardProps {
    results: BacktestResults;
}

export default function BacktestResultsDashboard({ results }: BacktestResultsDashboardProps) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <BacktestResultMetricCard
                title="Total Return"
                value={`${results.totalReturn.toFixed(2)}%`}
                Icon={results.totalReturn >= 0 ? ArrowUp : ArrowDown}
                valueClassName={results.totalReturn >= 0 ? "text-chart-1" : "text-chart-2"}
            />
             <BacktestResultMetricCard
                title="Final Value"
                value={`$${results.finalPortfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                Icon={CircleDollarSign}
            />
            <BacktestResultMetricCard
                title="Win Rate"
                value={`${results.winRate.toFixed(2)}%`}
                Icon={Target}
            />
            <BacktestResultMetricCard
                title="Profit Factor"
                value={results.profitFactor.toFixed(2)}
                Icon={Percent}
            />
            <BacktestResultMetricCard
                title="Sharpe Ratio"
                value={results.sharpeRatio.toFixed(2)}
                Icon={Scale}
            />
             <BacktestResultMetricCard
                title="Sortino Ratio"
                value={results.sortinoRatio.toFixed(2)}
                Icon={ShieldCheck}
            />
             <BacktestResultMetricCard
                title="Calmar Ratio"
                value={results.calmarRatio.toFixed(2)}
                Icon={AreaChart}
            />
            <BacktestResultMetricCard
                title="Max Drawdown"
                value={`${(results.maxDrawdown * 100).toFixed(2)}%`}
                Icon={ArrowDown}
                valueClassName="text-chart-2"
            />
            <BacktestResultMetricCard
                title="Total Trades"
                value={results.totalTrades}
                Icon={Calculator}
            />
             <BacktestResultMetricCard
                title="Avg. Trade P/L"
                value={`$${results.avgTradeReturn.toFixed(2)}`}
                Icon={ArrowRightLeft}
                valueClassName={results.avgTradeReturn >= 0 ? "text-chart-1" : "text-chart-2"}
            />
             <BacktestResultMetricCard
                title="Max Consecutive Losses"
                value={results.maxConsecutiveLosses}
                Icon={ChevronsDown}
            />
             <BacktestResultMetricCard
                title="Initial Capital"
                value={`$${results.initialCapital.toLocaleString()}`}
                Icon={Briefcase}
            />
        </div>
    );
}

'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpDown, Trophy } from "lucide-react";
import { Badge } from "../ui/badge";
import React, { useMemo, useState } from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

const initialData = [
  { strategy: 'RSI Momentum', totalReturn: 18.5, winRate: 62.1, sharpeRatio: 1.25, maxDrawdown: -12.3 },
  { strategy: 'MACD Crossover', totalReturn: 15.2, winRate: 58.4, sharpeRatio: 1.05, maxDrawdown: -15.8 },
  { strategy: 'SMA Golden Cross', totalReturn: 12.8, winRate: 55.2, sharpeRatio: 0.92, maxDrawdown: -18.1 },
  { strategy: 'AI Prediction Model', totalReturn: 25.6, winRate: 75.8, sharpeRatio: 1.98, maxDrawdown: -8.5 },
];

type SortKey = keyof typeof initialData[0];

export default function StrategyComparison() {
  const [data, setData] = useState(initialData);
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'ascending' | 'descending' } | null>({ key: 'totalReturn', direction: 'descending' });

  const sortedData = useMemo(() => {
    let sortableItems = [...data];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [data, sortConfig]);

  const requestSort = (key: SortKey) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  const bestStrategy = useMemo(() => {
    return sortedData.reduce((prev, current) => (prev.totalReturn > current.totalReturn) ? prev : current)
  }, [sortedData]);


  const renderSortArrow = (key: SortKey) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground/50" />;
    }
    if (sortConfig.direction === 'ascending') {
      return <ArrowUpDown className="ml-2 h-4 w-4" />;
    }
    return <ArrowUpDown className="ml-2 h-4 w-4" />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <Trophy className="h-6 w-6 text-yellow-400" />
            Strategy Comparison
        </CardTitle>
        <CardDescription>Compare the performance of different backtested strategies.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button variant="ghost" onClick={() => requestSort('strategy')}>
                  Strategy
                  {renderSortArrow('strategy')}
                </Button>
              </TableHead>
              <TableHead className="text-right">
                <Button variant="ghost" onClick={() => requestSort('totalReturn')}>
                  Total Return
                   {renderSortArrow('totalReturn')}
                </Button>
              </TableHead>
              <TableHead className="text-right">
                <Button variant="ghost" onClick={() => requestSort('winRate')}>
                  Win Rate
                  {renderSortArrow('winRate')}
                </Button>
              </TableHead>
              <TableHead className="text-right">
                <Button variant="ghost" onClick={() => requestSort('sharpeRatio')}>
                  Sharpe Ratio
                  {renderSortArrow('sharpeRatio')}
                </Button>
              </TableHead>
              <TableHead className="text-right">
                <Button variant="ghost" onClick={() => requestSort('maxDrawdown')}>
                  Max Drawdown
                  {renderSortArrow('maxDrawdown')}
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.map((item) => (
              <TableRow key={item.strategy} className={cn(item.strategy === bestStrategy.strategy && 'bg-primary/10')}>
                <TableCell className="font-medium">
                    {item.strategy}
                    {item.strategy === bestStrategy.strategy && <Badge variant="default" className="ml-2">Best</Badge>}
                </TableCell>
                <TableCell className="text-right font-semibold text-chart-1">{item.totalReturn.toFixed(1)}%</TableCell>
                <TableCell className="text-right">{item.winRate.toFixed(1)}%</TableCell>
                <TableCell className="text-right">{item.sharpeRatio.toFixed(2)}</TableCell>
                <TableCell className="text-right text-chart-2">{item.maxDrawdown.toFixed(1)}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

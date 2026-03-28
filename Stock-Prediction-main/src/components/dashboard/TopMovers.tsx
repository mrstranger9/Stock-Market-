import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

const topGainer = { symbol: 'NVDA', price: 950.02, change: '+25.43', changePercent: '+2.75%' };
const topLoser = { symbol: 'TSLA', price: 180.01, change: '-2.50', changePercent: '-1.37%' };

function MoverCard({ title, stock, icon: Icon, color }: { title: string, stock: any, icon: React.ElementType, color: string }) {
    return (
        <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
                <Icon className={cn("h-5 w-5", color)} />
            </CardHeader>
            <CardContent>
                <div className="text-xl font-bold">{stock.symbol}</div>
                <p className="text-sm text-muted-foreground">${stock.price.toFixed(2)}</p>
                <div className={cn("text-sm font-semibold flex items-center gap-1 mt-1", color)}>
                   <span>{stock.change}</span>
                   <span>({stock.changePercent})</span>
                </div>
            </CardContent>
        </Card>
    );
}

export default function TopMovers() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MoverCard title="Top Gainer" stock={topGainer} icon={TrendingUp} color="text-chart-1" />
        <MoverCard title="Top Loser" stock={topLoser} icon={TrendingDown} color="text-chart-2" />
    </div>
  );
}

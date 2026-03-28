import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownRight, ArrowUpRight, Ban } from "lucide-react";
import type { AISignalGenerationOutput } from "@/ai/flows/ai-signal-generation-flow";

interface TradeSuggestionCardProps {
  tradeSuggestion: AISignalGenerationOutput['tradeSuggestion'];
}

export default function TradeSuggestionCard({ tradeSuggestion }: TradeSuggestionCardProps) {
  const { entryPrice, targetPrice, stopLoss } = tradeSuggestion;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trade Suggestion</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-3 gap-4 text-center">
        <div className="space-y-1 rounded-lg bg-muted/50 p-4">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <ArrowUpRight className="h-4 w-4 text-green-400" />
            <span>Target Price</span>
          </div>
          <p className="text-2xl font-bold">${targetPrice.toFixed(2)}</p>
        </div>
        <div className="space-y-1 rounded-lg border-2 border-primary/50 bg-primary/10 p-4">
          <div className="flex items-center justify-center gap-2 text-sm text-primary">
            <span>Entry Price</span>
          </div>
          <p className="text-2xl font-bold text-primary">${entryPrice.toFixed(2)}</p>
        </div>
        <div className="space-y-1 rounded-lg bg-muted/50 p-4">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <ArrowDownRight className="h-4 w-4 text-red-400" />
            <span>Stop Loss</span>
          </div>
          <p className="text-2xl font-bold">${stopLoss.toFixed(2)}</p>
        </div>
      </CardContent>
    </Card>
  );
}

'use client';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

export function MetricCard({ title, value, icon: Icon, change, changeColor }: {
  title: string;
  value: string;
  icon: LucideIcon;
  change?: string;
  changeColor?: string;
}) {
  const [currentValue, setCurrentValue] = useState(value);
  const [animationClass, setAnimationClass] = useState('');

  useEffect(() => {
    // Only animate numerical values
    const originalNum = parseFloat(value.replace(/[^0-9.-]+/g,""));
    if (isNaN(originalNum)) return;

    const interval = setInterval(() => {
      const changeFactor = (Math.random() - 0.5) * 0.005; // Smaller change
      const newNum = originalNum * (1 + changeFactor);

      if (value.includes('$')) {
        setCurrentValue(`$${newNum.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`);
      } else if (value.includes('%')) {
        setCurrentValue(`${newNum.toFixed(1)}%`);
      } else {
        setCurrentValue(Math.round(newNum).toLocaleString());
      }
      
      setAnimationClass(changeFactor > 0 ? 'text-chart-1' : 'text-chart-2');
      setTimeout(() => setAnimationClass(''), 1000); // Animation duration
    }, 2000 + Math.random() * 3000); // Update every 2-5 seconds

    return () => clearInterval(interval);
  }, [value]);


  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className={cn("text-2xl font-bold transition-colors duration-500", animationClass)}>{currentValue}</div>
        {change && (
          <p className={cn("text-xs text-muted-foreground", changeColor)}>
            {change}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

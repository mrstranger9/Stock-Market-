'use client';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  aiSignalGeneration,
  type AISignalGenerationOutput,
} from '@/ai/flows/ai-signal-generation-flow';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Sparkles, WandSparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import SignalCard from './signal-card';
import FeatureImportanceChart from './feature-importance-chart';
import AIAnalysisCard from './ai-analysis-card';
import TradeSuggestionCard from './trade-suggestion-card';

const formSchema = z.object({
    stockSymbol: z.string().min(1, 'Stock symbol is required.').toUpperCase(),
    timeframe: z.enum(['1D', '1W', '1M', '3M', '1Y']),
});

const loadingSteps = [
    "Analyzing market trends...",
    "Scanning technical indicators...",
    "Selecting best AI model...",
    "Finalizing prediction...",
];

export default function SignalEngineClient() {
    const [isLoading, setIsLoading] = useState(false);
    const [loadingStep, setLoadingStep] = useState(0);
    const [signalOutput, setSignalOutput] = useState<AISignalGenerationOutput | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isLoading) {
            interval = setInterval(() => {
                setLoadingStep((prev) => (prev + 1) % loadingSteps.length);
            }, 1500);
        }
        return () => clearInterval(interval);
    }, [isLoading]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            stockSymbol: '',
            timeframe: '1D',
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        setLoadingStep(0);
        setSignalOutput(null);
        try {
            const result = await aiSignalGeneration(values);
            setSignalOutput(result);
        } catch (error) {
            console.error('Error generating signal:', error);
            toast({
                variant: 'destructive',
                title: 'Error Generating Signal',
                description: 'There was a problem generating the trading signal. Please try again.',
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-1 space-y-8">
                <Card className="hover:shadow-xl hover:border-primary/20 transition-all">
                    <CardHeader>
                        <div className='flex justify-between items-start'>
                            <div>
                                <CardTitle>Signal Generation</CardTitle>
                                <CardDescription>Configure your signal parameters.</CardDescription>
                            </div>
                            <div className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary border border-primary/20">
                                <Sparkles className="h-3 w-3" />
                                <span>Auto-Select Mode</span>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="stockSymbol"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Stock Symbol</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g., AAPL, TSLA" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="timeframe"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Timeframe</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a timeframe" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {['1D', '1W', '1M', '3M', '1Y'].map(tf => (
                                                        <SelectItem key={tf} value={tf}>{tf}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormDescription>
                                                Our AI automatically selects the best model for your signal.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <WandSparkles className="mr-2 h-4 w-4" />
                                    )}
                                    Generate Signal
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
                {signalOutput && (
                    <div className="animate-in fade-in-50 duration-500">
                        <AIAnalysisCard analysis={signalOutput.analysis} />
                    </div>
                )}
            </div>
            <div className="lg:col-span-2">
                {isLoading ? (
                     <div className="flex flex-col items-center justify-center h-full min-h-[600px] border-2 border-dashed rounded-lg space-y-4 text-center">
                        <Loader2 className="h-16 w-16 animate-spin text-primary" />
                        <p className="text-lg font-semibold">Generating AI Signal...</p>
                        <p className="text-muted-foreground">{loadingSteps[loadingStep]}</p>
                    </div>
                ) : signalOutput ? (
                    <div className="space-y-8 animate-in fade-in-50 duration-500">
                        <SignalCard stockSymbol={form.getValues('stockSymbol')} signalOutput={signalOutput} />
                        <TradeSuggestionCard tradeSuggestion={signalOutput.tradeSuggestion} />
                        <Card>
                            <CardHeader>
                                <CardTitle>Feature Importance</CardTitle>
                                <CardDescription>Contribution of technical indicators to the signal.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <FeatureImportanceChart featureImportance={signalOutput.featureImportance} />
                            </CardContent>
                        </Card>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full min-h-[600px] border-2 border-dashed rounded-lg text-center p-8">
                        <WandSparkles className="h-16 w-16 text-muted-foreground/30" />
                        <h3 className="mt-4 text-lg font-semibold text-muted-foreground">Your AI-generated signal will appear here</h3>
                        <p className="mt-2 text-sm text-muted-foreground/80">
                            Enter a stock symbol and select a timeframe to get started. The AI will analyze the market and provide a detailed trading signal with entry points, targets, and a full analysis.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

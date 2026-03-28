'use server';
/**
 * @fileOverview An AI agent for generating stock trading signals.
 *
 * - aiSignalGeneration - A function that handles the AI signal generation process.
 * - AISignalGenerationInput - The input type for the aiSignalGeneration function.
 * - AISignalGenerationOutput - The return type for the aiSignalGeneration function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Input schema for the public-facing flow. Model is removed.
const AISignalGenerationInputSchema = z.object({
  stockSymbol: z.string().describe('The stock ticker symbol (e.g., AAPL, TSLA).'),
  timeframe: z.enum(['1D', '1W', '1M', '3M', '1Y']).describe('The timeframe for the signal generation.'),
});
export type AISignalGenerationInput = z.infer<typeof AISignalGenerationInputSchema>;

// Internal schema used for the prompt, which still requires a model.
const InternalPromptInputSchema = AISignalGenerationInputSchema.extend({
    model: z.enum(['XGBoost', 'Gradient Boost', 'LSTM Neural Network', 'Random Forest']).describe('The machine learning model to use for the prediction.'),
});


const AISignalGenerationOutputSchema = z.object({
  signal: z.enum(['BUY', 'SELL', 'HOLD']).describe('The trading signal for the stock.'),
  confidenceScore: z.number().min(0).max(100).describe('The confidence level of the generated signal, from 0 to 100.'),
  analysis: z.string().describe('A brief, 2-3 sentence explanation of the reasoning behind the signal, mentioning the most important indicators.'),
  tradeSuggestion: z.object({
    entryPrice: z.number().describe('Suggested entry price for the trade.'),
    targetPrice: z.number().describe('Suggested target price for taking profit.'),
    stopLoss: z.number().describe('Suggested stop-loss price to limit potential losses.'),
  }).describe('A hypothetical trade suggestion including entry, target, and stop-loss prices.'),
  featureImportance: z.object({
    RSI: z.number().min(0).max(100).describe('Relative Strength Index importance score (0-100).'),
    MACD: z.number().min(0).max(100).describe('Moving Average Convergence Divergence importance score (0-100).'),
    Volume: z.number().min(0).max(100).describe('Trading Volume importance score (0-100).'),
    MovingAverage: z.number().min(0).max(100).describe('Moving Average importance score (0-100).'),
    BollingerBands: z.number().min(0).max(100).describe('Bollinger Bands importance score (0-100).'),
    ATR: z.number().min(0).max(100).describe('Average True Range importance score (0-100).'),
  }).describe('Scores indicating the importance of various technical indicators in generating the signal.'),
  modelParameters: z.object({
    accuracy: z.number().min(0).max(100).optional().describe('The accuracy of the model.'),
    trees: z.number().int().positive().optional().describe('The number of trees in the model (for tree-based models).'),
    maxDepth: z.number().int().positive().optional().describe('The maximum depth of the trees (for tree-based models).'),
  }).optional().describe('Parameters of the machine learning model used.'),
  modelUsed: z.string().describe('The AI model that was automatically selected to generate the signal.'),
});
export type AISignalGenerationOutput = z.infer<typeof AISignalGenerationOutputSchema>;

export async function aiSignalGeneration(input: AISignalGenerationInput): Promise<AISignalGenerationOutput> {
  return aiSignalGenerationFlow(input);
}

const aiSignalGenerationPrompt = ai.definePrompt({
  name: 'aiSignalGenerationPrompt',
  input: {schema: InternalPromptInputSchema},
  output: {schema: AISignalGenerationOutputSchema.omit({ modelUsed: true })},
  prompt: `You are an expert financial analyst simulating a stock trading signal generator.
Your task is to act as if you are a '{{{model}}}' model and provide a trading signal (BUY, SELL, or HOLD) for a given stock and timeframe.
You must also provide:
1.  A confidence score (0-100).
2.  A brief analysis (2-3 sentences) explaining the reasoning behind the signal, mentioning the most important indicators.
3.  A hypothetical trade suggestion with an entry price, target price, and stop loss. The prices should be realistic for a stock.
4.  Importance scores (0-100) for each technical indicator.
5.  Hypothetical model parameters (accuracy, trees, maxDepth) if the model is tree-based.

Analyze the hypothetical market data from the perspective of a {{{model}}} model and generate a signal based on its typical trading strategies.

Stock Symbol: {{{stockSymbol}}}
Timeframe: {{{timeframe}}}
Model: {{{model}}}

Based on this information, provide a JSON output following the specified schema. Ensure all fields are populated with realistic financial data.`,
});

// Helper function for auto model selection
function selectBestModel(timeframe: AISignalGenerationInput['timeframe']): InternalPromptInputSchema['shape']['model']['_def']['values'][number] {
    switch (timeframe) {
        case '1D':
            return 'Random Forest';
        case '1W':
            return 'XGBoost';
        case '1M':
            return 'Gradient Boost';
        case '3M':
            return 'LSTM Neural Network';
        case '1Y':
            return 'LSTM Neural Network';
        default:
            return 'Random Forest'; // Fallback model
    }
}

const aiSignalGenerationFlow = ai.defineFlow(
  {
    name: 'aiSignalGenerationFlow',
    inputSchema: AISignalGenerationInputSchema,
    outputSchema: AISignalGenerationOutputSchema,
  },
  async input => {
    // 1. Auto-select the model
    const selectedModel = selectBestModel(input.timeframe);

    // 2. Call the prompt with the selected model
    const {output} = await aiSignalGenerationPrompt({
        ...input,
        model: selectedModel,
    });
    
    // 3. Return the prompt's output along with the model that was used.
    return {
        ...output!,
        modelUsed: selectedModel,
    };
  }
);

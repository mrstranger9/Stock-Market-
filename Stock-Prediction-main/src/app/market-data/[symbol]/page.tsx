import StockDetailsClient from '@/components/market-data/stock-details-client';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: { symbol: string } }) {
    const symbol = params.symbol.toUpperCase();
    return {
        title: `${symbol} Stock Analysis | QuantAxis AI`,
        description: `Detailed market data, charts, and analysis for ${symbol}.`,
    };
}

export async function generateStaticParams() {
    return [
        { symbol: 'RELIANCE' },
        { symbol: 'HDFCBANK' },
        { symbol: 'TCS' },
        { symbol: 'INFY' },
    ];
}

export default function StockDetailsPage({ params }: { params: { symbol: string } }) {
    if (!params.symbol) {
        notFound();
    }
    return <StockDetailsClient symbol={params.symbol.toUpperCase()} />;
}

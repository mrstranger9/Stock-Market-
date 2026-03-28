import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const performanceData = [
  { metric: 'Annualized Return', value: '15.2%', description: 'The geometric average amount of money earned by an investment each year over a given time period.' },
  { metric: 'Volatility', value: '18.5%', description: 'The standard deviation of returns, a measure of risk.' },
  { metric: 'Beta', value: '1.1', description: 'A measure of a stock\'s volatility in relation to the overall market (S&P 500).' },
  { metric: 'Alpha', value: '2.5%', description: 'The excess return of an investment relative to the return of a benchmark index.' },
  { metric: 'Sortino Ratio', value: '2.1', description: 'A variation of the Sharpe ratio that differentiates harmful volatility from total overall volatility.' },
];

export default function PerformanceTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-1/3">Metric</TableHead>
          <TableHead className="w-1/3">Value</TableHead>
          <TableHead className="w-1/3">Description</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {performanceData.map((item) => (
          <TableRow key={item.metric}>
            <TableCell className="font-medium">{item.metric}</TableCell>
            <TableCell className="font-semibold text-lg">{item.value}</TableCell>
            <TableCell className="text-muted-foreground">{item.description}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

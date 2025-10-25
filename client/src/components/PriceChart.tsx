import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import type { PriceHistory } from '@shared/schema';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PriceChartProps {
  data: PriceHistory[];
  title?: string;
  showForecast?: boolean;
  forecastData?: Array<{ date: string; predicted: number; lower: number; upper: number }>;
}

export function PriceChart({ data, title = 'Price History', showForecast = false, forecastData = [] }: PriceChartProps) {
  const chartData = data.map(d => ({
    date: new Date(d.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
    price: d.avgPrice,
    high: d.high,
    low: d.low,
  }));

  const combinedData = showForecast && forecastData.length > 0
    ? [
        ...chartData,
        ...forecastData.map(f => ({
          date: new Date(f.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
          price: undefined,
          predicted: f.predicted,
          lower: f.lower,
          upper: f.upper,
        })),
      ]
    : chartData;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          {showForecast ? (
            <AreaChart data={combinedData}>
              <defs>
                <linearGradient id="confidenceBand" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="date" 
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                tickLine={{ stroke: 'hsl(var(--border))' }}
              />
              <YAxis 
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                tickLine={{ stroke: 'hsl(var(--border))' }}
                tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px',
                }}
                formatter={(value: any) => [`₹${value?.toLocaleString()}`, '']}
              />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="upper"
                stackId="1"
                stroke="none"
                fill="url(#confidenceBand)"
                name="Confidence Band"
              />
              <Area 
                type="monotone" 
                dataKey="lower"
                stackId="1"
                stroke="none"
                fill="url(#confidenceBand)"
              />
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--primary))' }}
                name="Historical Price"
              />
              <Line 
                type="monotone" 
                dataKey="predicted" 
                stroke="hsl(var(--accent))" 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: 'hsl(var(--accent))' }}
                name="Forecast"
              />
            </AreaChart>
          ) : (
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="date" 
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                tickLine={{ stroke: 'hsl(var(--border))' }}
              />
              <YAxis 
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                tickLine={{ stroke: 'hsl(var(--border))' }}
                tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px',
                }}
                formatter={(value: any) => [`₹${value?.toLocaleString()}`, '']}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--primary))' }}
                name="Average Price"
              />
              <Line 
                type="monotone" 
                dataKey="high" 
                stroke="hsl(var(--chart-4))" 
                strokeWidth={1}
                strokeDasharray="3 3"
                name="High"
              />
              <Line 
                type="monotone" 
                dataKey="low" 
                stroke="hsl(var(--destructive))" 
                strokeWidth={1}
                strokeDasharray="3 3"
                name="Low"
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

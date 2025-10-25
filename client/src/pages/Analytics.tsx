import { useState } from 'react';
import { Download, TrendingUp, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { PriceChart } from '@/components/PriceChart';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import type { PriceHistory } from '@shared/schema';
import { predictor } from '@/lib/predictor';

export default function Analytics() {
  const [product, setProduct] = useState('soymeal');
  const [forecastDays, setForecastDays] = useState(30);

  const { data: priceHistory } = useQuery<PriceHistory[]>({
    queryKey: ['/api/market/price-history', { product, range: '90d' }],
  });

  const forecast = priceHistory ? predictor.forecastPrice(priceHistory, forecastDays) : [];
  const volatility = priceHistory ? predictor.calculateVolatility(priceHistory.map(p => p.avgPrice)) : null;
  const recommendation = priceHistory && priceHistory.length > 0
    ? predictor.getRecommendation(forecast, priceHistory[priceHistory.length - 1].avgPrice)
    : null;

  const handleDownloadCSV = () => {
    if (!priceHistory) return;

    const csvContent = [
      ['Date', 'Price', 'High', 'Low', 'Volume'].join(','),
      ...priceHistory.map(p => [
        new Date(p.date).toLocaleDateString(),
        p.avgPrice,
        p.high,
        p.low,
        p.volume,
      ].join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `price-history-${product}-${Date.now()}.csv`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="font-['Poppins'] text-4xl font-bold mb-2">Market Analytics</h1>
            <p className="text-muted-foreground">AI-powered price forecasting and market insights</p>
          </div>
          <Button onClick={handleDownloadCSV} variant="outline" className="gap-2" data-testid="button-download-csv">
            <Download className="h-5 w-5" />
            Export CSV
          </Button>
        </div>

        {/* Controls */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium mb-2 block">Product</label>
                <Select value={product} onValueChange={setProduct}>
                  <SelectTrigger data-testid="select-product">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="soymeal">Soymeal (48% Protein)</SelectItem>
                    <SelectItem value="sunflower_cake">Sunflower Cake</SelectItem>
                    <SelectItem value="husk">Mustard Husk</SelectItem>
                    <SelectItem value="specialty">Specialty By-products</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Forecast Horizon: {forecastDays} days
                </label>
                <Slider
                  min={7}
                  max={90}
                  step={1}
                  value={[forecastDays]}
                  onValueChange={([value]) => setForecastDays(value)}
                  data-testid="slider-forecast-days"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Volatility Score */}
          {volatility && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  Volatility Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold">{volatility.percentage}%</span>
                    <Badge
                      variant={
                        volatility.level === 'low'
                          ? 'default'
                          : volatility.level === 'medium'
                          ? 'secondary'
                          : 'destructive'
                      }
                    >
                      {volatility.level.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{volatility.explanation}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recommendation */}
          {recommendation && (
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  AI Recommendation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="text-3xl font-bold text-primary mb-1">{recommendation.action}</div>
                      <div className="text-sm text-muted-foreground">
                        Confidence: {recommendation.confidence}%
                      </div>
                    </div>
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-2xl font-bold text-primary">{recommendation.confidence}%</span>
                    </div>
                  </div>
                  <p className="text-muted-foreground">{recommendation.reason}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Price Forecast Chart */}
        {priceHistory && priceHistory.length > 0 && (
          <PriceChart
            data={priceHistory}
            title={`${product.charAt(0).toUpperCase() + product.slice(1)} Price Forecast`}
            showForecast={true}
            forecastData={forecast}
          />
        )}

        {/* Market Insights */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Supply-Demand Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Current Supply</span>
                  <span className="font-bold">12,500 tons</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Current Demand</span>
                  <span className="font-bold">14,200 tons</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Market Balance</span>
                  <Badge variant="destructive">Deficit: 1,700 tons</Badge>
                </div>
                <p className="text-sm text-muted-foreground pt-2 border-t border-border">
                  Supply shortage may drive prices up in the short term. Consider holding inventory for better returns.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Regional Price Variation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { region: 'North India', price: 42500, change: 2.3 },
                  { region: 'West India', price: 41800, change: 1.8 },
                  { region: 'South India', price: 43200, change: 3.1 },
                  { region: 'East India', price: 40900, change: -0.5 },
                ].map((region) => (
                  <div key={region.region} className="flex justify-between items-center">
                    <span className="text-sm">{region.region}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">₹{region.price.toLocaleString()}</span>
                      <span
                        className={`text-xs font-medium ${
                          region.change >= 0
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-red-600 dark:text-red-400'
                        }`}
                      >
                        {region.change >= 0 ? '+' : ''}{region.change}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

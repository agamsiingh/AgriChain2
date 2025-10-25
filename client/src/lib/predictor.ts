import type { PriceHistory } from '@shared/schema';

export interface PriceForecast {
  date: string;
  predicted: number;
  lower: number;
  upper: number;
}

export interface Recommendation {
  action: 'Hold' | 'Sell' | 'Store' | 'Export';
  confidence: number;
  reason: string;
}

export interface VolatilityScore {
  level: 'low' | 'medium' | 'high';
  percentage: number;
  explanation: string;
}

export class Predictor {
  forecastPrice(history: PriceHistory[], days: number = 30): PriceForecast[] {
    if (history.length === 0) return [];

    const sortedHistory = [...history].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const recentPrices = sortedHistory.slice(-30).map(h => h.avgPrice);
    const avgPrice = recentPrices.reduce((a, b) => a + b, 0) / recentPrices.length;
    
    // Simple exponential smoothing with trend
    const alpha = 0.3;
    const beta = 0.1;
    let level = recentPrices[0];
    let trend = 0;

    for (let i = 1; i < recentPrices.length; i++) {
      const prevLevel = level;
      level = alpha * recentPrices[i] + (1 - alpha) * (level + trend);
      trend = beta * (level - prevLevel) + (1 - beta) * trend;
    }

    const forecasts: PriceForecast[] = [];
    const lastDate = new Date(sortedHistory[sortedHistory.length - 1].date);

    for (let i = 1; i <= days; i++) {
      const forecast = level + trend * i;
      const volatility = this.calculateVolatility(recentPrices).percentage;
      const confidence = 1.96 * (volatility / 100) * forecast;

      const forecastDate = new Date(lastDate);
      forecastDate.setDate(forecastDate.getDate() + i);

      forecasts.push({
        date: forecastDate.toISOString().split('T')[0],
        predicted: Math.round(forecast),
        lower: Math.round(forecast - confidence),
        upper: Math.round(forecast + confidence),
      });
    }

    return forecasts;
  }

  calculateVolatility(prices: number[]): VolatilityScore {
    if (prices.length < 2) {
      return { level: 'low', percentage: 0, explanation: 'Insufficient data for volatility calculation' };
    }

    const returns = [];
    for (let i = 1; i < prices.length; i++) {
      returns.push((prices[i] - prices[i - 1]) / prices[i - 1]);
    }

    const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
    const variance = returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / returns.length;
    const stdDev = Math.sqrt(variance);
    const volatilityPct = stdDev * 100;

    let level: 'low' | 'medium' | 'high';
    let explanation: string;

    if (volatilityPct < 5) {
      level = 'low';
      explanation = 'Prices are stable with minimal fluctuations. Low risk for trading.';
    } else if (volatilityPct < 10) {
      level = 'medium';
      explanation = 'Moderate price variations observed. Standard market conditions.';
    } else {
      level = 'high';
      explanation = 'High price swings detected. Exercise caution in trading decisions.';
    }

    return {
      level,
      percentage: Math.round(volatilityPct * 10) / 10,
      explanation,
    };
  }

  getRecommendation(forecast: PriceForecast[], currentPrice: number): Recommendation {
    if (forecast.length === 0) {
      return {
        action: 'Hold',
        confidence: 50,
        reason: 'Insufficient data for recommendation',
      };
    }

    const avgForecast = forecast.slice(0, 7).reduce((sum, f) => sum + f.predicted, 0) / 7;
    const priceChange = ((avgForecast - currentPrice) / currentPrice) * 100;

    let action: Recommendation['action'];
    let confidence: number;
    let reason: string;

    if (priceChange > 5) {
      action = 'Hold';
      confidence = Math.min(95, 70 + priceChange);
      reason = `Prices expected to rise by ${priceChange.toFixed(1)}% in the next week. Hold for better returns.`;
    } else if (priceChange > 2) {
      action = 'Store';
      confidence = 75;
      reason = 'Moderate price increase expected. Store for short-term gains.';
    } else if (priceChange < -3) {
      action = 'Sell';
      confidence = Math.min(95, 80 + Math.abs(priceChange));
      reason = `Prices may decline by ${Math.abs(priceChange).toFixed(1)}%. Consider selling soon.`;
    } else if (currentPrice > 45000) {
      action = 'Export';
      confidence = 85;
      reason = 'Premium pricing opportunity. Explore export markets for higher margins.';
    } else {
      action = 'Hold';
      confidence = 60;
      reason = 'Stable market conditions. Hold current position.';
    }

    return { action, confidence: Math.round(confidence), reason };
  }
}

export const predictor = new Predictor();

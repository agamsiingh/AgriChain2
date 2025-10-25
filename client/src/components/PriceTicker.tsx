import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';

interface PriceUpdate {
  product: string;
  price: number;
  change: number;
}

export function PriceTicker() {
  const [prices, setPrices] = useState<PriceUpdate[]>([
    { product: 'Soymeal (48%)', price: 42000, change: 2.3 },
    { product: 'Sunflower Cake', price: 38500, change: -1.2 },
    { product: 'Mustard Husk', price: 12000, change: 0.8 },
    { product: 'Specialty By-products', price: 55000, change: 3.5 },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPrices(prev => prev.map(p => ({
        ...p,
        price: p.price + (Math.random() - 0.5) * 200,
        change: (Math.random() - 0.5) * 4,
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-card border-y border-card-border overflow-hidden">
      <div className="relative">
        <motion.div
          className="flex gap-8 py-3 px-4"
          animate={{ x: [0, -1000] }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.animationPlayState = 'paused')}
          onMouseLeave={(e) => (e.currentTarget.style.animationPlayState = 'running')}
        >
          {[...prices, ...prices, ...prices].map((price, idx) => (
            <div key={idx} className="flex items-center gap-2 whitespace-nowrap">
              <span className="text-sm font-medium">{price.product}</span>
              <span className="text-sm font-bold">₹{Math.round(price.price).toLocaleString()}</span>
              <span
                className={`flex items-center gap-1 text-xs font-medium ${
                  price.change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}
              >
                {price.change >= 0 ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {Math.abs(price.change).toFixed(1)}%
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

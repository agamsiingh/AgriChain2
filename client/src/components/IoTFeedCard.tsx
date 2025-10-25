import { Droplets, Thermometer, Weight, Wifi, WifiOff } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface IoTReading {
  moisture?: number;
  temp?: number;
  weight_kg?: number;
  timestamp?: string;
}

interface IoTFeedCardProps {
  deviceId: string;
  name: string;
  reading: IoTReading;
  isConnected?: boolean;
}

export function IoTFeedCard({ deviceId, name, reading, isConnected = true }: IoTFeedCardProps) {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    setPulse(true);
    const timeout = setTimeout(() => setPulse(false), 500);
    return () => clearTimeout(timeout);
  }, [reading]);

  const getStatusColor = (value: number, type: 'moisture' | 'temp' | 'weight') => {
    if (type === 'moisture') {
      if (value < 8) return 'text-green-600 dark:text-green-400';
      if (value < 12) return 'text-amber-600 dark:text-amber-400';
      return 'text-red-600 dark:text-red-400';
    }
    if (type === 'temp') {
      if (value < 25) return 'text-green-600 dark:text-green-400';
      if (value < 30) return 'text-amber-600 dark:text-amber-400';
      return 'text-red-600 dark:text-red-400';
    }
    return 'text-foreground';
  };

  return (
    <Card className={pulse ? 'ring-2 ring-primary/50 transition-all' : ''}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{name}</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant={isConnected ? 'default' : 'secondary'} className="gap-1">
              {isConnected ? (
                <>
                  <Wifi className="h-3 w-3" />
                  <span>Live</span>
                </>
              ) : (
                <>
                  <WifiOff className="h-3 w-3" />
                  <span>Offline</span>
                </>
              )}
            </Badge>
          </div>
        </div>
        <p className="text-xs text-muted-foreground" data-testid={`text-device-id-${deviceId}`}>
          {deviceId}
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {reading.moisture !== undefined && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Droplets className="h-5 w-5 text-blue-500" />
              <span className="text-sm text-muted-foreground">Moisture</span>
            </div>
            <motion.span
              className={`text-2xl font-bold ${getStatusColor(reading.moisture, 'moisture')}`}
              animate={pulse ? { scale: [1, 1.1, 1] } : {}}
              data-testid={`text-moisture-${deviceId}`}
            >
              {reading.moisture.toFixed(1)}%
            </motion.span>
          </div>
        )}

        {reading.temp !== undefined && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Thermometer className="h-5 w-5 text-orange-500" />
              <span className="text-sm text-muted-foreground">Temperature</span>
            </div>
            <motion.span
              className={`text-2xl font-bold ${getStatusColor(reading.temp, 'temp')}`}
              animate={pulse ? { scale: [1, 1.1, 1] } : {}}
              data-testid={`text-temp-${deviceId}`}
            >
              {reading.temp.toFixed(1)}°C
            </motion.span>
          </div>
        )}

        {reading.weight_kg !== undefined && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Weight className="h-5 w-5 text-primary" />
              <span className="text-sm text-muted-foreground">Weight</span>
            </div>
            <motion.span
              className="text-2xl font-bold"
              animate={pulse ? { scale: [1, 1.1, 1] } : {}}
              data-testid={`text-weight-${deviceId}`}
            >
              {(reading.weight_kg / 1000).toFixed(2)}t
            </motion.span>
          </div>
        )}

        {reading.timestamp && (
          <div className="text-xs text-muted-foreground text-right pt-2 border-t border-border">
            Last updated: {new Date(reading.timestamp).toLocaleTimeString()}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

import { useEffect, useState } from 'react';
import { Plus, Wifi } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { IoTFeedCard } from '@/components/IoTFeedCard';
import { useQuery } from '@tanstack/react-query';
import type { IotDevice } from '@shared/schema';

export default function IoTMonitor() {
  const [liveUpdates, setLiveUpdates] = useState<Map<string, any>>(new Map());

  const { data: devices } = useQuery<IotDevice[]>({
    queryKey: ['/api/iot/devices'],
  });

  useEffect(() => {
    // Simulate live updates
    const interval = setInterval(() => {
      if (devices) {
        devices.forEach((device) => {
          const currentReading = typeof device.currentReading === 'string'
            ? JSON.parse(device.currentReading)
            : device.currentReading || {};

          const newReading = {
            moisture: currentReading.moisture ? currentReading.moisture + (Math.random() - 0.5) * 0.5 : 9.0,
            temp: currentReading.temp ? currentReading.temp + (Math.random() - 0.5) * 1.0 : 28.0,
            weight_kg: currentReading.weight_kg ? currentReading.weight_kg + (Math.random() - 0.5) * 100 : 12000,
            timestamp: new Date().toISOString(),
          };

          setLiveUpdates((prev) => new Map(prev).set(device.id, newReading));
        });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [devices]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="font-['Poppins'] text-4xl font-bold mb-2 flex items-center gap-3">
              <Wifi className="h-10 w-10 text-primary" />
              IoT Monitor
            </h1>
            <p className="text-muted-foreground">Real-time sensor data from connected devices</p>
          </div>
          <Button className="gap-2" data-testid="button-add-device">
            <Plus className="h-5 w-5" />
            Add Device
          </Button>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Devices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{devices?.length || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Online</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">{devices?.length || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Offline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-muted-foreground">0</div>
            </CardContent>
          </Card>
        </div>

        {/* Device Grid */}
        {devices && devices.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {devices.map((device) => {
              const reading = liveUpdates.get(device.id) || (typeof device.currentReading === 'string'
                ? JSON.parse(device.currentReading)
                : device.currentReading || {});

              return (
                <IoTFeedCard
                  key={device.id}
                  deviceId={device.id}
                  name={device.name}
                  reading={reading}
                  isConnected={true}
                />
              );
            })}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="h-24 w-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                <Wifi className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-2">No IoT devices connected</h3>
              <p className="text-muted-foreground mb-6">
                Add your first IoT device to start monitoring product quality in real-time
              </p>
              <Button data-testid="button-add-first-device">
                <Plus className="h-5 w-5 mr-2" />
                Add Your First Device
              </Button>
            </div>
          </Card>
        )}

        {/* Live Feed Log */}
        {devices && devices.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Live Update Feed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {Array.from(liveUpdates.entries()).reverse().slice(0, 10).map(([deviceId, reading], idx) => {
                  const device = devices.find(d => d.id === deviceId);
                  return (
                    <div key={`${deviceId}-${idx}`} className="flex items-center justify-between p-2 rounded-lg bg-muted/50 text-sm">
                      <span className="font-medium">{device?.name}</span>
                      <span className="text-muted-foreground">
                        {reading.moisture?.toFixed(1)}% | {reading.temp?.toFixed(1)}°C | {(reading.weight_kg / 1000).toFixed(2)}t
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {reading.timestamp ? new Date(reading.timestamp).toLocaleTimeString() : ''}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

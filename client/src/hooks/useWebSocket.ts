import { useEffect } from 'react';
import { wsClient } from '@/lib/websocket';
import type { WebSocketMessage } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

export function useWebSocket() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    wsClient.connect();

    const unsubscribe = wsClient.subscribe((message: WebSocketMessage) => {
      switch (message.type) {
        case 'price_update':
          // Silently update - shown in ticker
          break;

        case 'new_listing':
          toast({
            title: 'New Listing',
            description: `${message.listing.title} is now available`,
          });
          queryClient.invalidateQueries({ queryKey: ['/api/listings'] });
          break;

        case 'iot_update':
          // Update IoT device data
          queryClient.invalidateQueries({ queryKey: ['/api/iot/devices'] });
          break;
      }
    });

    return () => {
      unsubscribe();
    };
  }, [toast, queryClient]);
}

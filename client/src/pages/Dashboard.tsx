import { TrendingUp, Package, ShoppingCart, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PriceTicker } from '@/components/PriceTicker';
import { PriceChart } from '@/components/PriceChart';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import type { PriceHistory, ListingWithSeller, Order } from '@shared/schema';
import { useAppContext } from '@/contexts/AppContext';
import { useTranslation } from '@/lib/i18n';
import { Link } from 'wouter';
import { Badge } from '@/components/ui/badge';

export default function Dashboard() {
  const { currentUser, locale } = useAppContext();
  const t = useTranslation(locale);

  const { data: priceHistory } = useQuery<PriceHistory[]>({
    queryKey: ['/api/market/price-history', { product: 'soymeal', range: '30d' }],
  });

  const { data: listings } = useQuery<ListingWithSeller[]>({
    queryKey: ['/api/listings', { limit: 5 }],
  });

  const { data: orders } = useQuery<Order[]>({
    queryKey: ['/api/orders'],
  });

  const stats = [
    {
      title: t.dashboard.totalListings,
      value: listings?.length || 0,
      icon: Package,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    },
    {
      title: t.dashboard.activeOrders,
      value: orders?.filter(o => o.status !== 'delivered').length || 0,
      icon: ShoppingCart,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
    },
    {
      title: t.dashboard.revenue,
      value: `₹${((orders?.reduce((sum, o) => sum + o.agreedPrice, 0) || 0) / 100000).toFixed(1)}L`,
      icon: TrendingUp,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: t.dashboard.pendingActions,
      value: orders?.filter(o => o.status === 'negotiation').length || 0,
      icon: AlertCircle,
      color: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-100 dark:bg-amber-900/30',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <PriceTicker />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-['Poppins'] text-4xl font-bold mb-2">
            {t.dashboard.welcome}, {currentUser?.name || 'Guest'}
          </h1>
          <p className="text-muted-foreground">Here's what's happening with your trading activity</p>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="hover-elevate transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className={`h-10 w-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold" data-testid={`stat-${index}`}>{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Price Chart */}
          {priceHistory && priceHistory.length > 0 && (
            <PriceChart data={priceHistory} title="Soymeal Price Trend (30 Days)" />
          )}

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>{t.dashboard.recentActivity}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orders?.slice(0, 5).map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-sm">Order #{order.id.slice(0, 8)}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge
                      variant={
                        order.status === 'delivered'
                          ? 'default'
                          : order.status === 'escrow_confirmed'
                          ? 'secondary'
                          : 'outline'
                      }
                    >
                      {order.status}
                    </Badge>
                    <span className="font-bold text-sm ml-4">₹{order.agreedPrice.toLocaleString()}</span>
                  </div>
                )) || (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No recent orders</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Link href="/create-listing">
              <Button data-testid="button-create-listing">Create New Listing</Button>
            </Link>
            <Link href="/marketplace">
              <Button variant="outline" data-testid="button-browse-marketplace">Browse Marketplace</Button>
            </Link>
            <Link href="/analytics">
              <Button variant="outline" data-testid="button-view-analytics">View Analytics</Button>
            </Link>
            <Link href="/iot">
              <Button variant="outline" data-testid="button-iot-monitor">IoT Monitor</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { ArrowLeft, MapPin, Star, Package, MessageCircle, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useQuery } from '@tanstack/react-query';
import type { ListingWithSeller, IotDevice } from '@shared/schema';
import { Link, useParams } from 'wouter';
import { IoTFeedCard } from '@/components/IoTFeedCard';
import { EscrowModal } from '@/components/EscrowModal';

export default function ListingDetail() {
  const { id } = useParams<{ id: string }>();
  const [showEscrow, setShowEscrow] = useState(false);

  const { data: listing, isLoading } = useQuery<ListingWithSeller>({
    queryKey: [`/api/listings/${id}`],
  });

  const { data: iotDevice } = useQuery<IotDevice>({
    queryKey: [`/api/iot/devices/${listing?.iotDeviceId}`],
    enabled: !!listing?.iotDeviceId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading listing...</p>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-12 text-center max-w-md">
          <h2 className="text-2xl font-bold mb-2">Listing not found</h2>
          <p className="text-muted-foreground mb-6">The listing you're looking for doesn't exist or has been removed.</p>
          <Link href="/marketplace">
            <Button>Back to Marketplace</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const location = typeof listing.location === 'string' ? JSON.parse(listing.location) : listing.location;
  const quality = typeof listing.quality === 'string' ? JSON.parse(listing.quality) : listing.quality;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Link href="/marketplace">
          <Button variant="ghost" className="mb-6 gap-2" data-testid="button-back">
            <ArrowLeft className="h-5 w-5" />
            Back to Marketplace
          </Button>
        </Link>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image */}
            <Card>
              <div className="relative h-96 bg-gradient-to-br from-primary/10 to-accent/10">
                {listing.images && listing.images.length > 0 ? (
                  <img src={listing.images[0]} alt={listing.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Package className="h-24 w-24 text-muted-foreground/30" />
                  </div>
                )}
              </div>
            </Card>

            {/* Details */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h1 className="font-['Poppins'] text-3xl font-bold mb-2" data-testid="text-listing-title">
                      {listing.title}
                    </h1>
                    <p className="text-lg text-muted-foreground">{listing.grade}</p>
                  </div>
                  <Badge variant="secondary" className="mt-1">
                    {listing.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="text-3xl font-bold text-primary mb-1" data-testid="text-price">
                    ₹{listing.pricePerTon.toLocaleString()}
                    <span className="text-lg text-muted-foreground ml-2">per ton</span>
                  </div>
                  <p className="text-muted-foreground">
                    Total: ₹{((listing.pricePerTon * listing.quantityKg) / 1000).toLocaleString()}
                  </p>
                </div>

                <Separator />

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground">Quantity Available</label>
                    <p className="text-xl font-bold">{(listing.quantityKg / 1000).toFixed(1)} tons</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Product Type</label>
                    <p className="text-xl font-bold capitalize">{listing.type}</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-bold text-lg mb-3">Quality Metrics</h3>
                  <div className="grid grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{quality.moisture_pct}%</div>
                      <div className="text-sm text-muted-foreground">Moisture</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{quality.ash_pct}%</div>
                      <div className="text-sm text-muted-foreground">Ash Content</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{quality.oil_pct}%</div>
                      <div className="text-sm text-muted-foreground">Oil Content</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-5 w-5" />
                  <span>{location.address}</span>
                </div>
              </CardContent>
            </Card>

            {/* IoT Data */}
            {iotDevice && (
              <IoTFeedCard
                deviceId={iotDevice.id}
                name={iotDevice.name}
                reading={typeof iotDevice.currentReading === 'string' ? JSON.parse(iotDevice.currentReading) : iotDevice.currentReading || {}}
                isConnected={true}
              />
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Seller Info */}
            <Card>
              <CardHeader>
                <CardTitle>Seller Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-lg font-bold text-primary">
                    {listing.seller.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{listing.seller.name}</p>
                    <p className="text-sm text-muted-foreground capitalize">{listing.seller.role}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-accent text-accent" />
                  <span className="font-semibold">{listing.seller.rating.toFixed(1)}</span>
                  <span className="text-sm text-muted-foreground">(125 reviews)</span>
                </div>

                <Separator />

                <Button variant="outline" className="w-full gap-2" data-testid="button-message-seller">
                  <MessageCircle className="h-5 w-5" />
                  Message Seller
                </Button>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Purchase Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" data-testid="button-propose-offer">
                  Propose Offer
                </Button>
                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={() => setShowEscrow(true)}
                  data-testid="button-start-escrow"
                >
                  <Shield className="h-5 w-5" />
                  Start Escrow
                </Button>

                <div className="pt-3 border-t border-border">
                  <p className="text-xs text-muted-foreground">
                    Escrow protection available: Your payment is secured in a smart contract until delivery is confirmed
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <EscrowModal
        open={showEscrow}
        onClose={() => setShowEscrow(false)}
        amount={(listing.pricePerTon * listing.quantityKg) / 1000}
        onConfirm={(txHash) => {
          console.log('Escrow confirmed:', txHash);
        }}
      />
    </div>
  );
}

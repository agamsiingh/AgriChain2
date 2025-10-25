import { MapPin, Star, Package } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import type { ListingWithSeller } from '@shared/schema';
import { Link } from 'wouter';

interface ListingCardProps {
  listing: ListingWithSeller;
  index?: number;
}

export function ListingCard({ listing, index = 0 }: ListingCardProps) {
  const location = typeof listing.location === 'string' 
    ? JSON.parse(listing.location) 
    : listing.location;

  const quality = typeof listing.quality === 'string'
    ? JSON.parse(listing.quality)
    : listing.quality;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -6, scale: 1.02 }}
      className="h-full"
    >
      <Card className="h-full flex flex-col overflow-hidden hover-elevate transition-all duration-300">
        <div className="relative h-48 bg-gradient-to-br from-primary/10 to-accent/10 overflow-hidden">
          {listing.images && listing.images.length > 0 ? (
            <img 
              src={listing.images[0]} 
              alt={listing.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <Package className="h-16 w-16 text-muted-foreground/30" />
            </div>
          )}
          <div className="absolute top-3 right-3 flex gap-2">
            <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm">
              {listing.status}
            </Badge>
          </div>
        </div>

        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <h3 className="font-bold text-lg leading-tight mb-1" data-testid={`text-title-${listing.id}`}>
                {listing.title}
              </h3>
              <p className="text-sm text-muted-foreground">{listing.grade}</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 space-y-3 pb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Quantity:</span>
            <span className="font-semibold" data-testid={`text-quantity-${listing.id}`}>
              {(listing.quantityKg / 1000).toFixed(1)} tons
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Price:</span>
            <span className="text-xl font-bold text-primary" data-testid={`text-price-${listing.id}`}>
              ₹{listing.pricePerTon.toLocaleString()}
              <span className="text-xs text-muted-foreground ml-1">/ ton</span>
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border">
            <div className="text-center">
              <div className="text-xs text-muted-foreground">Moisture</div>
              <div className="text-sm font-semibold">{quality.moisture_pct}%</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-muted-foreground">Ash</div>
              <div className="text-sm font-semibold">{quality.ash_pct}%</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-muted-foreground">Oil</div>
              <div className="text-sm font-semibold">{quality.oil_pct}%</div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm pt-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground truncate">{location.address}</span>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                {listing.seller.name.charAt(0)}
              </div>
              <div>
                <div className="text-sm font-medium">{listing.seller.name}</div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Star className="h-3 w-3 fill-accent text-accent" />
                  <span>{listing.seller.rating.toFixed(1)}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="pt-4 border-t border-border flex gap-2">
          <Link href={`/listing/${listing.id}`} className="flex-1">
            <Button variant="outline" className="w-full" data-testid={`button-view-${listing.id}`}>
              View Details
            </Button>
          </Link>
          <Link href={`/listing/${listing.id}`} className="flex-1">
            <Button variant="default" className="w-full" data-testid={`button-propose-${listing.id}`}>
              Propose Offer
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

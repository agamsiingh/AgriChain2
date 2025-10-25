import { useState } from 'react';
import { Search, Filter, Grid3x3, List, Map as MapIcon, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { ListingCard } from '@/components/ListingCard';
import { useQuery } from '@tanstack/react-query';
import type { ListingWithSeller } from '@shared/schema';
import { Skeleton } from '@/components/ui/skeleton';
import { useAppContext } from '@/contexts/AppContext';
import { useTranslation } from '@/lib/i18n';

export default function Marketplace() {
  const { locale } = useAppContext();
  const t = useTranslation(locale);
  const [view, setView] = useState<'grid' | 'list' | 'map'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [productType, setProductType] = useState<string>('all');
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [showFilters, setShowFilters] = useState(true);

  const { data: listings, isLoading } = useQuery<ListingWithSeller[]>({
    queryKey: ['/api/listings', { query: searchQuery, type: productType }],
  });

  const filteredListings = listings?.filter((listing) => {
    const matchesPrice = listing.pricePerTon >= priceRange[0] && listing.pricePerTon <= priceRange[1];
    return matchesPrice;
  }) || [];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-['Poppins'] text-4xl font-bold mb-2">{t.marketplace.title}</h1>
          <p className="text-muted-foreground">Discover premium oilseed by-products from verified sellers</p>
        </div>

        {/* Search and View Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t.marketplace.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              data-testid="input-search"
            />
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowFilters(!showFilters)}
              data-testid="button-toggle-filters"
            >
              <Filter className="h-5 w-5" />
            </Button>

            <div className="flex border border-border rounded-lg">
              <Button
                variant={view === 'grid' ? 'secondary' : 'ghost'}
                size="icon"
                onClick={() => setView('grid')}
                className="rounded-r-none"
                data-testid="button-view-grid"
              >
                <Grid3x3 className="h-5 w-5" />
              </Button>
              <Button
                variant={view === 'list' ? 'secondary' : 'ghost'}
                size="icon"
                onClick={() => setView('list')}
                className="rounded-none border-x border-border"
                data-testid="button-view-list"
              >
                <List className="h-5 w-5" />
              </Button>
              <Button
                variant={view === 'map' ? 'secondary' : 'ghost'}
                size="icon"
                onClick={() => setView('map')}
                className="rounded-l-none"
                data-testid="button-view-map"
              >
                <MapIcon className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          {showFilters && (
            <aside className="lg:w-80 flex-shrink-0">
              <Card className="p-6 sticky top-4">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-lg">{t.marketplace.filters}</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden"
                    onClick={() => setShowFilters(false)}
                    data-testid="button-close-filters"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                <div className="space-y-6">
                  {/* Product Type */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Product Type</label>
                    <Select value={productType} onValueChange={setProductType}>
                      <SelectTrigger data-testid="select-product-type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent data-testid="select-product-type-content">
                        <SelectItem value="all" data-testid="select-product-all">All Products</SelectItem>
                        <SelectItem value="soymeal" data-testid="select-product-soymeal">Soymeal</SelectItem>
                        <SelectItem value="sunflower_cake" data-testid="select-product-sunflower">Sunflower Cake</SelectItem>
                        <SelectItem value="husk" data-testid="select-product-husk">Husk</SelectItem>
                        <SelectItem value="specialty" data-testid="select-product-specialty">Specialty Products</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Price Range (₹/ton)
                    </label>
                    <div className="mb-4">
                      <Slider
                        min={0}
                        max={100000}
                        step={1000}
                        value={priceRange}
                        onValueChange={setPriceRange}
                        className="mb-2"
                        data-testid="slider-price-range"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>₹{priceRange[0].toLocaleString()}</span>
                        <span>₹{priceRange[1].toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Active Filters */}
                  {(productType !== 'all' || priceRange[0] !== 0 || priceRange[1] !== 100000) && (
                    <div>
                      <label className="text-sm font-medium mb-2 block">Active Filters</label>
                      <div className="flex flex-wrap gap-2">
                        {productType !== 'all' && (
                          <Badge variant="secondary" className="gap-1" data-testid="badge-filter-product">
                            {productType}
                            <X
                              className="h-3 w-3 cursor-pointer"
                              onClick={() => setProductType('all')}
                              data-testid="button-remove-product-filter"
                            />
                          </Badge>
                        )}
                        {(priceRange[0] !== 0 || priceRange[1] !== 100000) && (
                          <Badge variant="secondary" className="gap-1" data-testid="badge-filter-price">
                            ₹{priceRange[0].toLocaleString()} - ₹{priceRange[1].toLocaleString()}
                            <X
                              className="h-3 w-3 cursor-pointer"
                              onClick={() => setPriceRange([0, 100000])}
                              data-testid="button-remove-price-filter"
                            />
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setProductType('all');
                      setPriceRange([0, 100000]);
                      setSearchQuery('');
                    }}
                    data-testid="button-clear-filters"
                  >
                    Clear All Filters
                  </Button>
                </div>
              </Card>
            </aside>
          )}

          {/* Listings Grid */}
          <main className="flex-1">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {filteredListings.length} listings found
              </p>
            </div>

            {isLoading ? (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="p-6">
                    <Skeleton className="h-48 w-full mb-4" />
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-4" />
                    <Skeleton className="h-10 w-full" />
                  </Card>
                ))}
              </div>
            ) : filteredListings.length === 0 ? (
              <Card className="p-12 text-center">
                <div className="max-w-md mx-auto">
                  <div className="h-24 w-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                    <Search className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">No listings found</h3>
                  <p className="text-muted-foreground mb-6">{t.marketplace.emptyState}</p>
                  <Button onClick={() => {
                    setProductType('all');
                    setPriceRange([0, 100000]);
                    setSearchQuery('');
                  }}>
                    Clear Filters
                  </Button>
                </div>
              </Card>
            ) : (
              <div className={view === 'grid' ? 'grid md:grid-cols-2 xl:grid-cols-3 gap-6' : 'space-y-4'}>
                {filteredListings.map((listing, index) => (
                  <ListingCard key={listing.id} listing={listing} index={index} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

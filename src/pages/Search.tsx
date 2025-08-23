import { useState, useCallback, useRef } from 'react';
import { Search as SearchIcon, Upload, X, Filter, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ProductCard from '@/components/common/ProductCard';
import FilterSidebar from '@/components/common/FilterSidebar';
import { ProductCardSkeleton } from '@/components/common/LoadingSkeleton';
import { cn } from '@/lib/utils';

interface SearchResults {
  products: Array<{
    id: string;
    image: string;
    brand: string;
    name: string;
    price: number;
    originalPrice?: number;
    tags: string[];
    isSustainable?: boolean;
    rating?: number;
  }>;
  total: number;
  page: number;
  hasMore: boolean;
}

const Search = () => {
  const [searchText, setSearchText] = useState('');
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [comparisonItems, setComparisonItems] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const removeImage = useCallback(() => {
    setUploadedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const handleSearch = useCallback(async () => {
    if (!searchText.trim() && !uploadedImage) return;

    setLoading(true);
    try {
      const formData = new FormData();
      if (searchText.trim()) {
        formData.append('text', searchText.trim());
      }
      if (uploadedImage) {
        formData.append('image', uploadedImage);
      }

      const response = await fetch('/api/search', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const results = await response.json();
        setSearchResults(results);
      } else {
        console.error('Search failed:', response.statusText);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  }, [searchText, uploadedImage]);

  const handleFiltersChange = useCallback(async (filters: any) => {
    setLoading(true);
    try {
      const searchParams = new URLSearchParams();
      
      // Add existing search parameters
      if (searchText.trim()) searchParams.append('text', searchText.trim());
      
      // Add filter parameters
      if (filters.priceRange) {
        searchParams.append('minPrice', filters.priceRange[0].toString());
        searchParams.append('maxPrice', filters.priceRange[1].toString());
      }
      if (filters.colors.length > 0) {
        searchParams.append('colors', filters.colors.join(','));
      }
      if (filters.categories.length > 0) {
        searchParams.append('categories', filters.categories.join(','));
      }
      if (filters.brands.length > 0) {
        searchParams.append('brands', filters.brands.join(','));
      }
      if (filters.sustainableOnly) {
        searchParams.append('sustainable', 'true');
      }

      const response = await fetch(`/api/search?${searchParams.toString()}`, {
        method: 'GET',
      });

      if (response.ok) {
        const results = await response.json();
        setSearchResults(results);
      }
    } catch (error) {
      console.error('Filter search error:', error);
    } finally {
      setLoading(false);
    }
  }, [searchText]);

  const toggleComparison = useCallback((productId: string) => {
    setComparisonItems(prev => 
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : prev.length < 4 ? [...prev, productId] : prev
    );
  }, []);

  const toggleFavorite = useCallback((productId: string) => {
    setFavorites(prev => 
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header */}
        <div className="space-y-6 mb-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground">
              Search Fashion
            </h1>
            <p className="text-muted-foreground">
              Use text, images, or both to find your perfect style
            </p>
          </div>

          {/* Search Input */}
          <div className="flex flex-col lg:flex-row gap-4 max-w-4xl mx-auto">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                type="text"
                placeholder="Describe what you're looking for..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="pl-12 h-14 text-lg border-2 focus:border-primary rounded-xl"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>

            {/* Image Upload */}
            <div className="flex gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <Button
                variant={uploadedImage ? "default" : "outline"}
                size="lg"
                onClick={() => fileInputRef.current?.click()}
                className="h-14 px-6"
              >
                <Upload className="w-5 h-5 mr-2" />
                {uploadedImage ? 'Change Image' : 'Upload Image'}
              </Button>
              
              <Button
                onClick={handleSearch}
                disabled={!searchText.trim() && !uploadedImage}
                size="lg"
                className="btn-fashion h-14 px-8"
              >
                <SearchIcon className="w-5 h-5 mr-2" />
                Search
              </Button>
            </div>
          </div>

          {/* Image Preview */}
          {imagePreview && (
            <div className="flex justify-center">
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Search image"
                  className="w-32 h-32 object-cover rounded-lg border-2 border-border"
                />
                <Button
                  size="icon"
                  variant="destructive"
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Search Results */}
        <div className="flex gap-6">
          {/* Filter Sidebar */}
          <FilterSidebar
            isOpen={showFilters}
            onClose={() => setShowFilters(false)}
            onFiltersChange={handleFiltersChange}
            className="hidden lg:block lg:relative"
          />

          {/* Results Section */}
          <div className="flex-1">
            {/* Results Header */}
            {(searchResults || loading) && (
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                  </Button>
                  
                  {searchResults && (
                    <p className="text-muted-foreground">
                      {searchResults.total} results found
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  {comparisonItems.length > 0 && (
                    <Button variant="outline" size="sm">
                      Compare ({comparisonItems.length})
                    </Button>
                  )}
                  
                  <div className="flex border border-border rounded-lg overflow-hidden">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                      className="rounded-none"
                    >
                      <Grid className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                      className="rounded-none"
                    >
                      <List className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className={cn(
                "grid gap-6",
                viewMode === 'grid' 
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  : "grid-cols-1"
              )}>
                {[...Array(8)].map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            )}

            {/* Results Grid */}
            {searchResults && !loading && (
              <div className={cn(
                "grid gap-6",
                viewMode === 'grid' 
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  : "grid-cols-1"
              )}>
                {searchResults.products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCompare={toggleComparison}
                    onToggleFavorite={toggleFavorite}
                    isFavorite={favorites.includes(product.id)}
                    isInComparison={comparisonItems.includes(product.id)}
                    className={viewMode === 'list' ? 'flex flex-row' : ''}
                  />
                ))}
              </div>
            )}

            {/* Empty State */}
            {!searchResults && !loading && (
              <div className="text-center py-16">
                <SearchIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Start Your Fashion Search
                </h3>
                <p className="text-muted-foreground">
                  Enter a description or upload an image to find similar styles
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Sidebar */}
      <FilterSidebar
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        onFiltersChange={handleFiltersChange}
        className="lg:hidden"
      />
    </div>
  );
};

export default Search;
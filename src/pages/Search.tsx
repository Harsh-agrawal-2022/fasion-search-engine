import { useState, useCallback, useRef, useEffect } from 'react';
import { Search as SearchIcon, Upload, X, Filter, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ProductCard from '@/components/common/ProductCard';
import FilterSidebar from '@/components/common/FilterSidebar';
import { ProductCardSkeleton } from '@/components/common/LoadingSkeleton';
import { cn } from '@/lib/utils';

// Assuming a product structure from your backend
interface Product {
  _id: string;
  imageUrl: string;
  brand: string;
  name: string;
  price: number;
  // Add any other fields your ProductCard might need
}

interface SearchResults {
  products: Product[];
  count: number;
  page: number;
  pages: number;
}

const Search = () => {
  const [searchText, setSearchText] = useState('');
  // Image upload functionality is complex with a JSON API, so we'll focus on text search first.
  // const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  // const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [comparisonItems, setComparisonItems] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [activeFilters, setActiveFilters] = useState({}); // State to hold current filters

  // --- UNIFIED SEARCH FUNCTION ---
  // This single function now handles all search and filter requests.
  const executeSearch = useCallback(async (query: string, filters: any, page = 1) => {
    setLoading(true);
    try {
      const body = {
        query: query,
        filters: filters,
        page: page,
        limit: 12
      };

      const response = await fetch('http://localhost:5000/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // IMPORTANT: Set content type to JSON
        },
        body: JSON.stringify(body), // Send data as a JSON string
      });

      if (response.ok) {
        const results = await response.json();
        // The backend returns 'count', let's rename it to 'total' for the frontend interface
        setSearchResults({ ...results, total: results.count });
      } else {
        const errorData = await response.json();
        console.error('Search failed:', response.statusText, errorData);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // --- EVENT HANDLERS ---

  // Initial search when user presses Enter or clicks the search button
  const handleSearch = () => {
    if (!searchText.trim()) return;
    // Reset filters for a new search
    setActiveFilters({}); 
    executeSearch(searchText.trim(), {});
  };

  // Called when filters are changed in the sidebar
  const handleFiltersChange = (newFilters: any) => {
    setActiveFilters(newFilters);
    executeSearch(searchText.trim(), newFilters);
  };

  // --- Helper functions for toggling UI elements ---

  const toggleComparison = useCallback((productId: string) => {
    setComparisonItems(prev =>
      prev.includes(productId) ? prev.filter(id => id !== productId) : prev.length < 4 ? [...prev, productId] : prev
    );
  }, []);

  const toggleFavorite = useCallback((productId: string) => {
    setFavorites(prev =>
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  }, []);
  
  // Note: Image upload logic has been commented out to focus on the primary text search fix.
  // Implementing image search would require a different backend setup (like multipart/form-data handling).

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
              Use text to find your perfect style
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
            <div className="flex gap-2">
              <Button
                onClick={handleSearch}
                disabled={!searchText.trim()}
                size="lg"
                className="btn-fashion h-14 px-8"
              >
                <SearchIcon className="w-5 h-5 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </div>

        {/* Search Results */}
        <div className="flex gap-6">
          {/* Filter Sidebar */}
          <FilterSidebar
            isOpen={showFilters}
            onClose={() => setShowFilters(false)}
            onFiltersChange={handleFiltersChange}
            className={cn("hidden lg:block lg:relative", { 'block': showFilters })}
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
                      {searchResults.count} results found
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
                  <ProductCardSkeleton key={`skeleton-${i}`} />
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
                    key={product._id}
                    // The product object from the backend needs to match what ProductCard expects
                    product={{ 
                        id: product._id, 
                        image: product.imageUrl, 
                        brand: product.brand,
                        name: product.name,
                        price: product.price,
                        tags: [], // Add tags if available in your backend model
                    }}
                    onAddToCompare={toggleComparison}
                    onToggleFavorite={toggleFavorite}
                    isFavorite={favorites.includes(product._id)}
                    isInComparison={comparisonItems.includes(product._id)}
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
                  Enter a description to find your perfect style
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;

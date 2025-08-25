import { useState, useCallback, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search as SearchIcon, X, Filter, Grid, List, Mic, MicOff, Upload, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ProductCard from '@/components/common/ProductCard';
import FilterSidebar from '@/components/common/FilterSidebar';
import { ProductCardSkeleton } from '@/components/common/LoadingSkeleton';
import { cn } from '@/lib/utils';

// Image URL converter utility
const convertImgBBUrl = (url) => {
  if (!url) return null;
  
  // Check if it's already a direct image URL
  if (url.includes('i.ibb.co/')) {
    return url;
  }
  
  // Check if it's an ImgBB page URL
  if (url.includes('ibb.co/')) {
    // Extract the image ID from the URL
    const match = url.match(/ibb\.co\/(?:img\/)?([a-zA-Z0-9]+)/);
    
    if (match) {
      const imageId = match[1];
      // Convert to direct URL
      return `https://i.ibb.co/${imageId}/${imageId}.jpg`;
    }
  }
  
  // If it's not an ImgBB URL, return as is
  return url;
};

// Interface for a single product from the backend
interface Product {
  _id: string;
  img: string;
  brand: string;
  name: string;
  price: number;
  tags?: string[];
}

// Interface for the entire API response
interface SearchResults {
  products: Product[];
  count: number;
  page: number;
  pages: number;
  suggestions?: string[];
}

// --- VOICE SEARCH SETUP ---
const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null;
if (recognition) {
    recognition.continuous = false;
    recognition.lang = 'en-US';
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
  const [activeFilters, setActiveFilters] = useState({});
  const [isListening, setIsListening] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- UNIFIED SEARCH FUNCTION ---
  const executeSearch = useCallback(async (query: string, image: File | null, filters: any, page = 1) => {
    if (!query.trim() && !image) return;
    setLoading(true);
    setSearchResults(null); // Clear previous results for a new search
    try {
        let body: FormData | string;
        let headers: HeadersInit = {};

        if (image) {
            const formData = new FormData();
            formData.append('image', image);
            formData.append('query', query);
            formData.append('filters', JSON.stringify(filters));
            formData.append('page', page.toString());
            formData.append('limit', '12');
            body = formData;
        } else {
            body = JSON.stringify({
                query: query,
                filters: filters,
                page: page,
                limit: 12
            });
            headers['Content-Type'] = 'application/json';
        }

      const response = await fetch('http://localhost:5000/api/search', {
        method: 'POST',
        headers: headers,
        body: body,
      });

      if (response.ok) {
        const results = await response.json();
        console.log('Search results:', results);
        setSearchResults(results);
      } else {
        const errorData = await response.json();
        console.error('Search failed:', response.statusText, errorData);
        setSearchResults({ products: [], count: 0, page: 1, pages: 0 }); // Set to empty results on error
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults({ products: [], count: 0, page: 1, pages: 0 }); // Set to empty results on error
    } finally {
      setLoading(false);
    }
  }, []);

  // --- EVENT HANDLERS ---
  const handleSearch = () => {
    executeSearch(searchText.trim(), uploadedImage, activeFilters);
  };

  const handleFiltersChange = (newFilters: any) => {
    setActiveFilters(newFilters);
    executeSearch(searchText.trim(), uploadedImage, newFilters);
  };

  // --- IMAGE UPLOAD HANDLERS ---
  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  }, []);

  const removeImage = useCallback(() => {
    setUploadedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, []);

  // --- VOICE SEARCH HANDLER ---
  const handleVoiceSearch = () => {
    if (!recognition) {
        console.warn("Sorry, your browser doesn't support voice recognition.");
        return;
    }
    if (isListening) {
        recognition.stop();
    } else {
        recognition.start();
    }
  };

  // Effect to handle speech recognition events
  useEffect(() => {
    if (!recognition) return;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setSearchText(transcript);
      executeSearch(transcript, uploadedImage, activeFilters);
    };
    
    return () => {
        if (recognition) {
            recognition.onstart = null;
            recognition.onend = null;
            recognition.onerror = null;
            recognition.onresult = null;
        }
    };
  }, [executeSearch, activeFilters, uploadedImage]);


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

  const handleGoToCompare = () => {
    if (comparisonItems.length > 0) {
        const ids = comparisonItems.join(',');
        window.location.href = `/compare?ids=${ids}`;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6 mb-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground">
              Search Fashion
            </h1>
            <p className="text-muted-foreground">
              Use text, images, or your voice to find your perfect style
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-4 max-w-4xl mx-auto">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                type="text"
                placeholder={isListening ? "Listening..." : "Describe what you're looking for..."}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="pl-12 h-14 text-lg border-2 focus:border-primary rounded-xl"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <div className="flex gap-2">
               <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <Button
                variant="outline"
                size="lg"
                onClick={() => fileInputRef.current?.click()}
                className="h-14 px-4"
              >
                <Upload className="w-5 h-5" />
              </Button>
              <Button
                onClick={handleVoiceSearch}
                size="lg"
                variant={isListening ? "destructive" : "outline"}
                className="h-14 px-4"
                aria-label={isListening ? "Stop listening" : "Start voice search"}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
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
          
          {imagePreview && (
            <div className="flex justify-center mt-4">
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Search preview"
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

        <div className="flex flex-col lg:flex-row gap-6">
          <FilterSidebar
            isOpen={showFilters}
            onClose={() => setShowFilters(false)}
            onFiltersChange={handleFiltersChange}
            className={cn("hidden lg:block lg:relative", { 'block': showFilters })}
          />

          <div className="flex-1">
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
                {comparisonItems.length > 0 && (
                    <Button onClick={handleGoToCompare}>
                        Compare ({comparisonItems.length})
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                )}
              </div>
            )}

            {searchResults?.suggestions && searchResults.suggestions.length > 0 && !loading && (
                <div className="mb-4 p-4 bg-secondary rounded-lg">
                    <p className="text-sm text-muted-foreground">Did you mean?</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {searchResults.suggestions.map((suggestion, index) => (
                            <Button key={index} variant="outline" size="sm" onClick={() => executeSearch(suggestion, null, {})}>
                                {suggestion}
                            </Button>
                        ))}
                    </div>
                </div>
            )}

            {loading && (
              <div className={cn("grid gap-6", viewMode === 'grid' ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1")}>
                {[...Array(8)].map((_, i) => <ProductCardSkeleton key={`skeleton-${i}`} />)}
              </div>
            )}

            {searchResults && !loading && searchResults.products.length > 0 && (
              <div className={cn("grid gap-6", viewMode === 'grid' ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1")}>
                {searchResults.products.map((product) => (
                  <Link to={`/product/${product._id}`} key={product._id}>
                    <ProductCard
                      product={{
                        id: product._id,
                        img: convertImgBBUrl(product.img) || `https://via.placeholder.com/300x300?text=${encodeURIComponent(product.name)}`, // Convert ImgBB URL here
                        brand: product.brand,
                        name: product.name,
                        price: product.price,
                        tags: [],
                    }}
                    onAddToCompare={toggleComparison}
                    onToggleFavorite={toggleFavorite}
                    isFavorite={favorites.includes(product._id)}
                    isInComparison={comparisonItems.includes(product._id)}
                    className={viewMode === 'list' ? 'flex flex-row' : ''}
                  /></Link>
                ))}
              </div>
            )}

            {searchResults && !loading && searchResults.products.length === 0 && (
                <div className="text-center py-16">
                    <SearchIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                        No Results Found
                    </h3>
                    <p className="text-muted-foreground">
                        Try a different search or adjust your filters.
                    </p>
                </div>
            )}

            {!searchResults && !loading && (
              <div className="text-center py-16">
                <SearchIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Start Your Fashion Search
                </h3>
                <p className="text-muted-foreground">
                  Enter a description, upload an image, or click the mic to find your perfect style
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
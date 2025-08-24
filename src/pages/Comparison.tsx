import { useState, useEffect, useCallback, useRef } from 'react';
import { ArrowUpDown, X, Plus, Star, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCardSkeleton } from '@/components/common/LoadingSkeleton';
import { cn } from '@/lib/utils';

// This interface now matches the data structure from your backend,
// including the AI-generated pros and cons.
interface ComparisonProduct {
  _id: string;
  img: string;
  brand: string;
  name: string;
  price: number;
  category: string;
  availableSizes: string[];
  colors: string[];
  pros?: string[];
  cons?: string[];
  avg_rating?: number;
}

interface ComparisonData {
    products: ComparisonProduct[];
    summary: string;
}

const Comparison = () => {
  const [comparisonData, setComparisonData] = useState<ComparisonData | null>(null);
  const [loading, setLoading] = useState(true);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const fetchComparisonData = useCallback(async (productIds: string[]) => {
    if (productIds.length === 0) {
        setComparisonData(null);
        setLoading(false);
        return;
    }
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/compare', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productIds }),
      });

      if (response.ok) {
        const data = await response.json();
        setComparisonData(data);
      } else {
        console.error('Failed to fetch comparison data:', await response.json());
        setComparisonData(null);
      }
    } catch (error) {
      console.error('Failed to fetch comparison data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const productIds = urlParams.get('ids')?.split(',') || [];
    
    fetchComparisonData(productIds);
  }, []);

  const removeProduct = (productIdToRemove: string) => {
    setComparisonData(prevData => {
        if (!prevData) return null;
        const newProducts = prevData.products.filter(p => p._id !== productIdToRemove);
        
        // Update URL to reflect removed item
        const newIds = newProducts.map(p => p._id).join(',');
        window.history.pushState({}, '', `?ids=${newIds}`);

        // If there are still products to compare, refetch the AI summary
        if (newProducts.length > 1) {
            fetchComparisonData(newProducts.map(p => p._id));
        } else {
            setComparisonData({ ...prevData, products: newProducts });
        }
        
        return { ...prevData, products: newProducts };
    });
  };

  const swapProducts = (fromIndex: number, toIndex: number) => {
    setComparisonData(prevData => {
      if (!prevData) return null;
      const newProducts = [...prevData.products];
      [newProducts[fromIndex], newProducts[toIndex]] = [newProducts[toIndex], newProducts[fromIndex]];
      return { ...prevData, products: newProducts };
    });
  };

  const handleDragStart = (index: number) => setDraggedIndex(index);
  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      swapProducts(draggedIndex, dropIndex);
    }
    setDraggedIndex(null);
  };

  const getComparisonRows = () => [
    { label: 'Price', key: 'price', type: 'price' },
    { label: 'Brand', key: 'brand', type: 'text' },
    { label: 'Category', key: 'category', type: 'text' },
    { label: 'Rating', key: 'avg_rating', type: 'rating' },
    { label: 'Available Sizes', key: 'availableSizes', type: 'array' },
    { label: 'Available Colors', key: 'colors', type: 'array' },
    { label: 'Pros', key: 'pros', type: 'list' },
    { label: 'Cons', key: 'cons', type: 'list' },
  ];
  
  const renderValue = (product: ComparisonProduct, key: string, type: string) => {
    const value = (product as any)[key];

    switch (type) {
      case 'price':
        return <div className="text-xl font-bold text-primary">${value?.toFixed(2)}</div>;
      
      case 'rating':
        return value ? (
          <div className="flex items-center space-x-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "w-4 h-4",
                    i < Math.round(value) ? "fill-primary text-primary" : "text-muted"
                  )}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">({Number(value).toFixed(1)})</span>
          </div>
        ) : <span className="text-muted-foreground">N/A</span>;
      
      case 'array':
        return Array.isArray(value) && value.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {value.slice(0, 5).map((item, i) => (
              <span key={i} className="px-2 py-1 bg-accent text-accent-foreground text-xs rounded-full">
                {item}
              </span>
            ))}
            {value.length > 5 && (
              <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
                +{value.length - 5}
              </span>
            )}
          </div>
        ) : <span className="text-muted-foreground">N/A</span>;
      
      case 'list':
        return Array.isArray(value) && value.length > 0 ? (
          <ul className="space-y-1 text-sm list-disc list-inside">
            {value.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        ) : <span className="text-muted-foreground">Not available</span>;
      
      default:
        return <span className={!value ? "text-muted-foreground" : ""}>{value || 'N/A'}</span>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <h1 className="text-3xl lg:text-4xl font-bold text-center mb-2">Product Comparison</h1>
        <p className="text-muted-foreground text-center mb-8">Analyzing products and generating comparison...</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(3)].map((_, i) => <ProductCardSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  if (!comparisonData || comparisonData.products.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center space-y-6">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto">
              <ArrowUpDown className="w-12 h-12 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground">
                Product Comparison
              </h1>
              <p className="text-lg text-muted-foreground">
                No products selected for comparison.
              </p>
            </div>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Go to the search page and add products to compare their features, prices, and specifications side by side.
              </p>
              <Button size="lg" className="btn-fashion" onClick={() => window.location.href = '/'}>
                <Plus className="w-5 h-5 mr-2" />
                Start Shopping
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { products, summary } = comparisonData;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
            Product Comparison
          </h1>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            {summary}
          </p>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-full align-middle">
            <div className="grid gap-4 mb-8" style={{ gridTemplateColumns: `150px repeat(${products.length}, minmax(200px, 1fr))` }}>
              <div></div> {/* Empty space for row labels */}
              {products.map((product, index) => (
                <div
                  key={product._id}
                  className="relative group"
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                >
                  <div className="border rounded-lg p-4 cursor-move h-full flex flex-col">
                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => removeProduct(product._id)}
                      className="absolute top-2 right-2 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                    <div className="aspect-square bg-muted rounded-lg mb-4 overflow-hidden">
                      <img
                        src={product.img}
                        alt={`${product.brand} ${product.name}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground font-medium">{product.brand}</p>
                      <h3 className="font-semibold text-card-foreground line-clamp-2">{product.name}</h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              {getComparisonRows().map((row) => (
                <div
                  key={row.key}
                  className="grid gap-4 py-4 border-b items-start"
                  style={{ gridTemplateColumns: `150px repeat(${products.length}, minmax(200px, 1fr))` }}
                >
                  <div className="font-semibold text-foreground px-4">{row.label}</div>
                  {products.map((product) => (
                    <div key={product._id} className="px-4">
                      {renderValue(product, row.key, row.type)}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Comparison;
import { useState, useEffect } from 'react';
import { ArrowUpDown, X, Plus, Star, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCardSkeleton } from '@/components/common/LoadingSkeleton';
import { cn } from '@/lib/utils';

interface ComparisonProduct {
  id: string;
  image: string;
  brand: string;
  name: string;
  price: number;
  originalPrice?: number;
  tags: string[];
  isSustainable?: boolean;
  rating?: number;
  specifications: {
    material: string;
    care: string;
    origin: string;
    sizes: string[];
    colors: string[];
  };
  pros: string[];
  cons: string[];
}

const Comparison = () => {
  const [comparisonProducts, setComparisonProducts] = useState<ComparisonProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  useEffect(() => {
    // Check if we have products to compare from URL params or state
    const urlParams = new URLSearchParams(window.location.search);
    const productIds = urlParams.get('ids')?.split(',') || [];
    
    if (productIds.length > 0) {
      fetchComparisonData(productIds);
    }
  }, []);

  const fetchComparisonData = async (productIds: string[]) => {
    setLoading(true);
    try {
      const response = await fetch('/api/compare', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productIds }),
      });

      if (response.ok) {
        const data = await response.json();
        setComparisonProducts(data.products);
      }
    } catch (error) {
      console.error('Failed to fetch comparison data:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeProduct = (index: number) => {
    setComparisonProducts(prev => prev.filter((_, i) => i !== index));
  };

  const swapProducts = (fromIndex: number, toIndex: number) => {
    setComparisonProducts(prev => {
      const newProducts = [...prev];
      [newProducts[fromIndex], newProducts[toIndex]] = [newProducts[toIndex], newProducts[fromIndex]];
      return newProducts;
    });
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

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
    { label: 'Rating', key: 'rating', type: 'rating' },
    { label: 'Material', key: 'specifications.material', type: 'text' },
    { label: 'Care Instructions', key: 'specifications.care', type: 'text' },
    { label: 'Origin', key: 'specifications.origin', type: 'text' },
    { label: 'Available Sizes', key: 'specifications.sizes', type: 'array' },
    { label: 'Available Colors', key: 'specifications.colors', type: 'array' },
    { label: 'Sustainability', key: 'isSustainable', type: 'boolean' },
    { label: 'Pros', key: 'pros', type: 'list' },
    { label: 'Cons', key: 'cons', type: 'list' },
  ];

  const getValue = (product: ComparisonProduct, key: string) => {
    const keys = key.split('.');
    let value: any = product;
    for (const k of keys) {
      value = value?.[k];
    }
    return value;
  };

  const renderValue = (product: ComparisonProduct, key: string, type: string) => {
    const value = getValue(product, key);

    switch (type) {
      case 'price':
        const discount = product.originalPrice 
          ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
          : 0;
        return (
          <div className="space-y-1">
            <div className="text-xl font-bold text-primary">${value}</div>
            {product.originalPrice && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground line-through">
                  ${product.originalPrice}
                </span>
                <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full">
                  -{discount}%
                </span>
              </div>
            )}
          </div>
        );
      
      case 'rating':
        return value ? (
          <div className="flex items-center space-x-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "w-4 h-4",
                    i < Math.floor(value) ? "fill-primary text-primary" : "text-muted"
                  )}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">({value.toFixed(1)})</span>
          </div>
        ) : <span className="text-muted-foreground">N/A</span>;
      
      case 'boolean':
        return value ? (
          <div className="flex items-center space-x-2 text-sustainable">
            <Leaf className="w-4 h-4" />
            <span className="font-medium">Yes</span>
          </div>
        ) : <span className="text-muted-foreground">No</span>;
      
      case 'array':
        return Array.isArray(value) ? (
          <div className="flex flex-wrap gap-1">
            {value.slice(0, 3).map((item, i) => (
              <span key={i} className="px-2 py-1 bg-accent text-accent-foreground text-xs rounded-full">
                {item}
              </span>
            ))}
            {value.length > 3 && (
              <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
                +{value.length - 3}
              </span>
            )}
          </div>
        ) : <span className="text-muted-foreground">N/A</span>;
      
      case 'list':
        return Array.isArray(value) ? (
          <ul className="space-y-1 text-sm">
            {value.slice(0, 3).map((item, i) => (
              <li key={i} className="flex items-start space-x-2">
                <span className="w-1 h-1 bg-current rounded-full mt-2 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
            {value.length > 3 && (
              <li className="text-muted-foreground">+{value.length - 3} more</li>
            )}
          </ul>
        ) : <span className="text-muted-foreground">N/A</span>;
      
      default:
        return <span className={!value ? "text-muted-foreground" : ""}>{value || 'N/A'}</span>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
              Product Comparison
            </h1>
            <p className="text-muted-foreground">Loading comparison data...</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (comparisonProducts.length === 0) {
    return (
      <div className="min-h-screen bg-background">
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
                No products selected for comparison
              </p>
            </div>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Go to the search page and add products to compare their features, prices, and specifications side by side.
              </p>
              <Button size="lg" className="btn-fashion">
                <Plus className="w-5 h-5 mr-2" />
                Start Shopping
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
            Product Comparison
          </h1>
          <p className="text-muted-foreground">
            Compare {comparisonProducts.length} products side by side
          </p>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-full">
            {/* Product Headers */}
            <div className="grid grid-cols-1 gap-4 mb-8" style={{ gridTemplateColumns: `200px repeat(${comparisonProducts.length}, 1fr)` }}>
              <div></div> {/* Empty space for row labels */}
              {comparisonProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="relative group"
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                >
                  <div className="product-card p-4 cursor-move">
                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => removeProduct(index)}
                      className="absolute top-2 right-2 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                    
                    <div className="aspect-square bg-muted rounded-lg mb-4 overflow-hidden">
                      <img
                        src={product.image}
                        alt={`${product.brand} ${product.name}`}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground font-medium">{product.brand}</p>
                      <h3 className="font-semibold text-card-foreground line-clamp-2">
                        {product.name}
                      </h3>
                      <div className="flex flex-wrap gap-1">
                        {product.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-accent text-accent-foreground text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Comparison Table */}
            <div className="space-y-2">
              {getComparisonRows().map((row) => (
                <div
                  key={row.key}
                  className="grid gap-4 py-4 border-b border-border"
                  style={{ gridTemplateColumns: `200px repeat(${comparisonProducts.length}, 1fr)` }}
                >
                  <div className="font-medium text-foreground px-4">
                    {row.label}
                  </div>
                  {comparisonProducts.map((product) => (
                    <div key={product.id} className="px-4">
                      {renderValue(product, row.key, row.type)}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 mt-8">
          <Button variant="outline" size="lg">
            <Plus className="w-5 h-5 mr-2" />
            Add More Products
          </Button>
          <Button size="lg" className="btn-fashion">
            Compare Alternatives
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Comparison;
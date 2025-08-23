import { useState } from 'react';
import { Heart, BarChart3, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: {
    id: string;
    image: string;
    brand: string;
    name: string;
    price: number;
    originalPrice?: number;
    tags: string[];
    isSustainable?: boolean;
    rating?: number;
  };
  onAddToCompare?: (productId: string) => void;
  onToggleFavorite?: (productId: string) => void;
  isFavorite?: boolean;
  isInComparison?: boolean;
  className?: string;
}

const ProductCard = ({
  product,
  onAddToCompare,
  onToggleFavorite,
  isFavorite = false,
  isInComparison = false,
  className
}: ProductCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className={cn("product-card group", className)}>
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
        <img
          src={product.image}
          alt={`${product.brand} ${product.name}`}
          className={cn(
            "product-image w-full h-full object-cover transition-all duration-500",
            imageLoaded ? "opacity-100" : "opacity-0"
          )}
          onLoad={() => setImageLoaded(true)}
        />
        
        {!imageLoaded && (
          <div className="absolute inset-0 skeleton animate-shimmer" />
        )}

        {/* Overlay Actions */}
        <div className="absolute top-3 right-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Button
            size="icon"
            variant="secondary"
            className="rounded-full w-8 h-8 backdrop-blur-sm"
            onClick={() => onToggleFavorite?.(product.id)}
          >
            <Heart className={cn("w-4 h-4", isFavorite && "fill-current text-red-500")} />
          </Button>
          
          <Button
            size="icon"
            variant="secondary"
            className={cn(
              "rounded-full w-8 h-8 backdrop-blur-sm",
              isInComparison && "bg-primary text-primary-foreground"
            )}
            onClick={() => onAddToCompare?.(product.id)}
          >
            <BarChart3 className="w-4 h-4" />
          </Button>
        </div>

        {/* Sustainability Badge */}
        {product.isSustainable && (
          <div className="absolute top-3 left-3 bg-sustainable text-sustainable-foreground px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
            <Leaf className="w-3 h-3" />
            <span>Eco</span>
          </div>
        )}

        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute bottom-3 left-3 bg-secondary text-secondary-foreground px-2 py-1 rounded-full text-xs font-bold">
            -{discount}%
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-2">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground font-medium">{product.brand}</p>
          <h3 className="font-semibold text-card-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {product.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-accent text-accent-foreground text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
          {product.tags.length > 3 && (
            <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
              +{product.tags.length - 3}
            </span>
          )}
        </div>

        {/* Price */}
        <div className="flex items-center space-x-2">
          <span className="text-lg font-bold text-primary">
            ${product.price}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              ${product.originalPrice}
            </span>
          )}
        </div>

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center space-x-1">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "w-3 h-3 rounded-full",
                    i < Math.floor(product.rating!)
                      ? "bg-primary"
                      : "bg-muted"
                  )}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              ({product.rating.toFixed(1)})
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
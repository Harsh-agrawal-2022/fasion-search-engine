import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, ShoppingCart, ShieldCheck, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import ProductCard from '@/components/common/ProductCard';
import { ProductCardSkeleton } from '@/components/common/LoadingSkeleton';

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

// Enhanced Image component with error handling
const ProductImage = ({ src, alt, className }) => {
  const [imgSrc, setImgSrc] = useState(convertImgBBUrl(src) || src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      
      // Try alternative ImgBB formats if the first one fails
      if (src && src.includes('ibb.co/') && !imgSrc.includes('i.ibb.co/')) {
        const match = src.match(/ibb\.co\/(?:img\/)?([a-zA-Z0-9]+)/);
        if (match) {
          const imageId = match[1];
          // Try different ImgBB direct URL formats
          const alternatives = [
            `https://i.ibb.co/${imageId}/${imageId}.png`,
            `https://i.ibb.co/${imageId}/${imageId}.jpeg`,
            `https://i.ibb.co/${imageId}/image.jpg`,
            `https://i.ibb.co/${imageId}/image.png`,
          ];
          
          // Try the first alternative that hasn't been tried
          const currentIndex = alternatives.indexOf(imgSrc);
          if (currentIndex < alternatives.length - 1) {
            setImgSrc(alternatives[currentIndex + 1]);
            setHasError(false); // Reset error to try again
            return;
          }
        }
      }
      
      // If all alternatives fail, use fallback
      setImgSrc(`https://via.placeholder.com/600x600?text=${encodeURIComponent(alt || 'Product Image')}`);
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={handleError}
    />
  );
};

// Types
interface Product {
  _id: string;
  img: string;
  brand: string;
  name: string;
  price: number;
  description: string;
  category: string;
  availableSizes?: string[];
  colors?: string[];
  avg_rating?: number;
  ratingCount?: number;
  tags?: string[];
}

interface ProductDetailsResponse {
  product: Product;
  relatedProducts: Product[];
}

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [productData, setProductData] = useState<ProductDetailsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      window.scrollTo(0, 0);

      try {
        const response = await fetch(`http://localhost:5000/api/products/${id}`);
        if (!response.ok) throw new Error('Product not found');

        const product: Product = await response.json();

        // 🔥 Wrap the single product in the expected structure
        setProductData({ product, relatedProducts: [] });
      } catch (err: any) {
        setError(err.message || 'Failed to load product details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (productData?.product) {
      console.log(`Added ${productData.product.name} to cart.`);
      setCartCount((prev) => prev + 1);
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="w-full h-[550px] bg-gray-200 animate-pulse rounded-lg"></div>
          <div className="space-y-6">
            <div className="h-6 w-1/4 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-10 w-3/4 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-10 w-1/3 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-32 w-full bg-gray-200 animate-pulse rounded"></div>
            <div className="h-14 w-full bg-gray-200 animate-pulse rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error || !productData || !productData.product) {
    return <div className="text-center py-20 text-red-500">{error || 'Product could not be loaded.'}</div>;
  }

  // Success State
  const { product, relatedProducts } = productData;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Product Image */}
          <div>
            <div className="aspect-w-1 aspect-h-1 bg-white p-4 rounded-lg shadow-md">
              <ProductImage
                src={product.img}
                alt={product.name}
                className="w-full h-full object-contain rounded-lg"
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{product.brand}</p>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mt-1">{product.name}</h1>
            </div>

            {product.avg_rating && (
              <div className="flex items-center">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        'w-5 h-5',
                        i < Math.round(product.avg_rating || 0) ? 'text-yellow-400' : 'text-gray-300'
                      )}
                      fill="currentColor"
                    />
                  ))}
                </div>
                <p className="ml-2 text-sm text-gray-500">{product.ratingCount} ratings</p>
              </div>
            )}

            <p className="text-4xl font-extrabold text-gray-800">${product.price.toFixed(2)}</p>

            <div
              className="prose max-w-none text-gray-600"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />

            <div className="space-y-4 pt-4">
              <Button
                size="lg"
                className="w-full h-14 text-lg btn-fashion shadow-lg hover:shadow-xl transition-shadow"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="w-6 h-6 mr-3" />
                Add to Cart {cartCount > 0 && `(${cartCount})`}
              </Button>
            </div>

            <div className="flex items-center text-sm text-gray-600 space-x-6 pt-4">
              <div className="flex items-center">
                <Truck className="w-5 h-5 mr-2 text-primary" />
                <span>Fast Delivery Available</span>
              </div>
              <div className="flex items-center">
                <ShieldCheck className="w-5 h-5 mr-2 text-primary" />
                <span>100% Genuine Products</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts && relatedProducts.length > 0 && (
          <div className="mt-24">
            <h2 className="text-2xl font-bold text-center mb-8">You Might Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((related) => (
                <Link to={`/product/${related._id}`} key={related._id} className="group">
                  <ProductCard
                    product={{
                      id: related._id,
                      img: convertImgBBUrl(related.img) || `https://via.placeholder.com/300x300?text=${encodeURIComponent(related.name)}`, // Convert ImgBB URL for related products too
                      brand: related.brand,
                      name: related.name,
                      price: related.price,
                      tags: [],
                    }}
                    onAddToCompare={() => {}}
                    onToggleFavorite={() => {}}
                    isFavorite={false}
                    isInComparison={false}
                  />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
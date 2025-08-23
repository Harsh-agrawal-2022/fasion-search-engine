import { useState, useEffect, useCallback } from 'react';
import { Heart, Shuffle, Filter, TrendingUp, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/common/ProductCard';
import { ProductCardSkeleton } from '@/components/common/LoadingSkeleton';
import { cn } from '@/lib/utils';

interface RecommendationProduct {
  id: string;
  image: string;
  brand: string;
  name: string;
  price: number;
  originalPrice?: number;
  tags: string[];
  isSustainable?: boolean;
  rating?: number;
  recommendationReason: string;
  trendingScore?: number;
}

interface RecommendationSection {
  title: string;
  subtitle: string;
  products: RecommendationProduct[];
  type: 'trending' | 'personalized' | 'similar' | 'sustainable';
}

const Recommendations = () => {
  const [recommendations, setRecommendations] = useState<RecommendationSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [comparisonItems, setComparisonItems] = useState<string[]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'trending' | 'personalized' | 'sustainable'>('all');

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      const response = await fetch('/api/recommend', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setRecommendations(data.sections);
      }
    } catch (error) {
      console.error('Failed to fetch recommendations:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const refreshRecommendations = async () => {
    setRefreshing(true);
    await fetchRecommendations();
  };

  const toggleFavorite = useCallback((productId: string) => {
    setFavorites(prev => 
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  }, []);

  const toggleComparison = useCallback((productId: string) => {
    setComparisonItems(prev => 
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : prev.length < 4 ? [...prev, productId] : prev
    );
  }, []);

  const getSectionIcon = (type: string) => {
    switch (type) {
      case 'trending': return TrendingUp;
      case 'personalized': return Heart;
      case 'sustainable': return Sparkles;
      default: return Sparkles;
    }
  };

  const filteredRecommendations = recommendations.filter(section => 
    activeFilter === 'all' || section.type === activeFilter
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-muted rounded-full animate-pulse mx-auto mb-4" />
            <div className="w-48 h-8 bg-muted rounded animate-pulse mx-auto mb-2" />
            <div className="w-64 h-4 bg-muted rounded animate-pulse mx-auto" />
          </div>
          
          <div className="space-y-12">
            {[...Array(3)].map((_, sectionIndex) => (
              <div key={sectionIndex} className="space-y-6">
                <div className="w-48 h-6 bg-muted rounded animate-pulse" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {[...Array(4)].map((_, i) => (
                    <ProductCardSkeleton key={i} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-8">
          <div className="w-16 h-16 bg-fashion-gradient rounded-full flex items-center justify-center mx-auto">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground">
              Discover Your Style
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Curated recommendations based on your preferences, current trends, and sustainable choices
            </p>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant={activeFilter === 'all' ? 'default' : 'outline'}
              onClick={() => setActiveFilter('all')}
            >
              All Recommendations
            </Button>
            <Button
              variant={activeFilter === 'trending' ? 'default' : 'outline'}
              onClick={() => setActiveFilter('trending')}
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Trending
            </Button>
            <Button
              variant={activeFilter === 'personalized' ? 'default' : 'outline'}
              onClick={() => setActiveFilter('personalized')}
            >
              <Heart className="w-4 h-4 mr-2" />
              For You
            </Button>
            <Button
              variant={activeFilter === 'sustainable' ? 'default' : 'outline'}
              onClick={() => setActiveFilter('sustainable')}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Sustainable
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            {comparisonItems.length > 0 && (
              <Button variant="outline">
                Compare ({comparisonItems.length})
              </Button>
            )}
            <Button
              variant="outline"
              onClick={refreshRecommendations}
              disabled={refreshing}
              className={cn(refreshing && 'animate-spin')}
            >
              <Shuffle className="w-4 h-4 mr-2" />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>
        </div>

        {/* Recommendation Sections */}
        <div className="space-y-12">
          {filteredRecommendations.map((section, sectionIndex) => {
            const SectionIcon = getSectionIcon(section.type);
            
            return (
              <section key={sectionIndex} className="space-y-6">
                <div className="flex items-center space-x-3">
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center",
                    section.type === 'trending' && "bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400",
                    section.type === 'personalized' && "bg-pink-100 text-pink-600 dark:bg-pink-900/20 dark:text-pink-400",
                    section.type === 'sustainable' && "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400",
                    section.type === 'similar' && "bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400"
                  )}>
                    <SectionIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">
                      {section.title}
                    </h2>
                    <p className="text-muted-foreground">
                      {section.subtitle}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {section.products.map((product) => (
                    <div key={product.id} className="space-y-3">
                      <ProductCard
                        product={product}
                        onAddToCompare={toggleComparison}
                        onToggleFavorite={toggleFavorite}
                        isFavorite={favorites.includes(product.id)}
                        isInComparison={comparisonItems.includes(product.id)}
                      />
                      
                      {/* Recommendation Reason */}
                      <div className="px-2">
                        <div className="flex items-start space-x-2">
                          <div className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0" />
                          <p className="text-sm text-muted-foreground">
                            {product.recommendationReason}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Load More Button */}
                <div className="text-center">
                  <Button variant="outline" size="lg">
                    Load More {section.title}
                  </Button>
                </div>
              </section>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredRecommendations.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <Filter className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No recommendations found
            </h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your filters or check back later for new recommendations
            </p>
            <Button onClick={() => setActiveFilter('all')} variant="outline">
              Show All Recommendations
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Recommendations;
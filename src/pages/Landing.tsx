import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Sparkles, Zap, Shield, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HeroSkeleton } from '@/components/common/LoadingSkeleton';
import fashionHero from '@/assets/fashion-hero.jpg';

interface HeroContent {
  title: string;
  subtitle: string;
  ctaText: string;
  features: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
}

const Landing = () => {
  const navigate = useNavigate();
  const [heroContent, setHeroContent] = useState<HeroContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  console.log(isLoggedIn);
  // Check login status
  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('token'));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    navigate('/login');
  };

  const handleStartSearch = () => {
    if (isLoggedIn) {
      navigate('/search');
    } else {
      alert('Please login first!');
      navigate('/login');
    }
  };

  useEffect(() => {
    const fetchHeroContent = async () => {
      try {
        const response = await fetch('/api/hero');
        if (response.ok) {
          const content = await response.json();
          setHeroContent(content);
        }
      } catch (error) {
        console.error('Failed to fetch hero content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroContent();
  }, []);

  const defaultFeatures = [
    {
      icon: 'search',
      title: 'AI-Powered Search',
      description: 'Find exactly what you\'re looking for with intelligent text and image search'
    },
    {
      icon: 'sparkles',
      title: 'Smart Recommendations',
      description: 'Discover new styles tailored to your unique taste and preferences'
    },
    {
      icon: 'shield',
      title: 'Sustainable Choices',
      description: 'Shop consciously with our sustainability tracking and eco-friendly options'
    }
  ];

  const getFeatureIcon = (iconName: string) => {
    switch (iconName) {
      case 'search': return Search;
      case 'sparkles': return Sparkles;
      case 'shield': return Shield;
      default: return Zap;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={fashionHero} 
            alt="Fashion collection showcase" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-fashion-gradient-subtle" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center space-y-8">
            {loading ? (
              <HeroSkeleton />
            ) : (
              <>
                <div className="space-y-4">
                  <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-foreground">
                    {heroContent?.title || (
                      <>
                        Discover Fashion
                        <span className="bg-fashion-gradient bg-clip-text text-transparent block">
                          Like Never Before
                        </span>
                      </>
                    )}
                  </h1>
                  <p className="text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto">
                    {heroContent?.subtitle || 
                      'AI-powered search engine that understands your style. Search with text, images, or both to find your perfect fashion match.'
                    }
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  {isLoggedIn ? (
                    <>
                      <Button size="lg" className="btn-fashion text-lg px-8 py-4 h-auto" onClick={handleStartSearch}>
                        <Search className="w-5 h-5 mr-2" />
                        {heroContent?.ctaText || 'Start Searching'}
                      </Button>
                      <Button size="lg" variant="outline" className="btn-fashion-outline text-lg px-8 py-4 h-auto flex items-center" onClick={handleLogout}>
                        <LogOut className="w-5 h-5 mr-2" />
                        Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link to="/login">
                        <Button size="lg" className="btn-fashion text-lg px-8 py-4 h-auto">
                          <Search className="w-5 h-5 mr-2" />
                          Start Searching
                        </Button>
                      </Link>
                      <Link to="/signup">
                        <Button size="lg" variant="outline" className="btn-fashion-outline text-lg px-8 py-4 h-auto">
                          Sign Up
                        </Button>
                      </Link>
                    </>
                  )}
                  <Link to="/recommendations">
                    <Button variant="outline" size="lg" className="btn-fashion-outline text-lg px-8 py-4 h-auto">
                      <Sparkles className="w-5 h-5 mr-2" />
                      Discover Styles
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary/20 rounded-full animate-float" />
        <div className="absolute bottom-20 right-10 w-16 h-16 bg-secondary/20 rounded-full animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-accent/30 rounded-full animate-float" style={{ animationDelay: '2s' }} />
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-32 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
              Why Choose StyleSearch?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience the future of fashion discovery with cutting-edge AI technology
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {(heroContent?.features || defaultFeatures).map((feature) => {
              const Icon = getFeatureIcon(feature.icon);
              return (
                <div
                  key={feature.title}
                  className="group text-center space-y-4 p-6 rounded-2xl hover:bg-card hover:shadow-card transition-all duration-300"
                >
                  <div className="w-16 h-16 bg-fashion-gradient rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-fashion-gradient opacity-90" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-6">
            <h2 className="text-3xl lg:text-4xl font-bold text-white">
              Ready to Transform Your Fashion Discovery?
            </h2>
            <p className="text-xl text-white/90">
              Join thousands of fashion enthusiasts who've revolutionized their shopping experience
            </p>
            <Button 
              size="lg" 
              variant="secondary"
              className="text-lg px-8 py-4 h-auto hover:scale-105 transition-transform"
              onClick={handleStartSearch}
            >
              <Search className="w-5 h-5 mr-2" />
              Begin Your Fashion Journey
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;

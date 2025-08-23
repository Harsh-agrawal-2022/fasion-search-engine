import { useState, useEffect } from 'react';
import { X, Filter, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { FilterSkeleton } from './LoadingSkeleton';
import { cn } from '@/lib/utils';

interface FilterOptions {
  colors: Array<{ id: string; name: string; hex: string }>;
  categories: Array<{ id: string; name: string; count: number }>;
  brands: Array<{ id: string; name: string; count: number }>;
  sizes: string[];
  minPrice: number;
  maxPrice: number;
}

interface FilterState {
  priceRange: [number, number];
  colors: string[];
  categories: string[];
  brands: string[];
  sizes: string[];
  sustainableOnly: boolean;
}

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onFiltersChange: (filters: FilterState) => void;
  className?: string;
}

const FilterSidebar = ({ isOpen, onClose, onFiltersChange, className }: FilterSidebarProps) => {
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    colors: true,
    categories: true,
    brands: false,
    sizes: false,
  });

  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 1000],
    colors: [],
    categories: [],
    brands: [],
    sizes: [],
    sustainableOnly: false,
  });

  // Fetch filter options from API
  useEffect(() => {
    const fetchFilters = async () => {
      setLoading(true);
      try {
        // Placeholder API call - replace with actual endpoint
        const response = await fetch('/api/filters');
        if (response.ok) {
          const options = await response.json();
          setFilterOptions(options);
          setFilters(prev => ({
            ...prev,
            priceRange: [options.minPrice, options.maxPrice]
          }));
        }
      } catch (error) {
        console.error('Failed to fetch filters:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchFilters();
    }
  }, [isOpen]);

  const updateFilters = (newFilters: Partial<FilterState>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const clearAllFilters = () => {
    const clearedFilters: FilterState = {
      priceRange: filterOptions ? [filterOptions.minPrice, filterOptions.maxPrice] : [0, 1000],
      colors: [],
      categories: [],
      brands: [],
      sizes: [],
      sustainableOnly: false,
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  if (!isOpen) return null;

  return (
    <div className={cn(
      "fixed inset-0 z-50 lg:relative lg:inset-auto lg:z-auto",
      "lg:w-80 lg:flex-shrink-0",
      className
    )}>
      {/* Mobile Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 lg:hidden"
        onClick={onClose}
      />

      {/* Sidebar Content */}
      <div className="fixed right-0 top-0 h-full w-80 bg-background border-l border-border overflow-y-auto lg:relative lg:w-full lg:border-r lg:border-l-0">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold">Filters</h2>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                Clear all
              </Button>
              <Button variant="ghost" size="icon" onClick={onClose} className="lg:hidden">
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {loading ? (
            <FilterSkeleton />
          ) : (
            <div className="space-y-6">
              {/* Sustainability Toggle */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">
                  Sustainable Only
                </label>
                <Switch
                  checked={filters.sustainableOnly}
                  onCheckedChange={(checked) => updateFilters({ sustainableOnly: checked })}
                />
              </div>

              {/* Price Range */}
              <div className="space-y-3">
                <button
                  onClick={() => toggleSection('price')}
                  className="flex items-center justify-between w-full text-sm font-medium text-foreground"
                >
                  Price Range
                  <ChevronDown className={cn(
                    "w-4 h-4 transition-transform",
                    expandedSections.price && "rotate-180"
                  )} />
                </button>
                
                {expandedSections.price && (
                  <div className="space-y-3">
                    <Slider
                      value={filters.priceRange}
                      onValueChange={(value) => updateFilters({ priceRange: value as [number, number] })}
                      max={filterOptions?.maxPrice || 1000}
                      min={filterOptions?.minPrice || 0}
                      step={10}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>${filters.priceRange[0]}</span>
                      <span>${filters.priceRange[1]}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Colors */}
              <div className="space-y-3">
                <button
                  onClick={() => toggleSection('colors')}
                  className="flex items-center justify-between w-full text-sm font-medium text-foreground"
                >
                  Colors
                  <ChevronDown className={cn(
                    "w-4 h-4 transition-transform",
                    expandedSections.colors && "rotate-180"
                  )} />
                </button>
                
                {expandedSections.colors && (
                  <div className="grid grid-cols-4 gap-2">
                    {filterOptions?.colors.map((color) => (
                      <button
                        key={color.id}
                        onClick={() => {
                          const newColors = filters.colors.includes(color.id)
                            ? filters.colors.filter(c => c !== color.id)
                            : [...filters.colors, color.id];
                          updateFilters({ colors: newColors });
                        }}
                        className={cn(
                          "w-8 h-8 rounded-full border-2 transition-all",
                          filters.colors.includes(color.id)
                            ? "border-primary shadow-lg scale-110"
                            : "border-muted hover:border-border"
                        )}
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Categories */}
              <div className="space-y-3">
                <button
                  onClick={() => toggleSection('categories')}
                  className="flex items-center justify-between w-full text-sm font-medium text-foreground"
                >
                  Categories
                  <ChevronDown className={cn(
                    "w-4 h-4 transition-transform",
                    expandedSections.categories && "rotate-180"
                  )} />
                </button>
                
                {expandedSections.categories && (
                  <div className="space-y-2">
                    {filterOptions?.categories.map((category) => (
                      <div key={category.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={category.id}
                          checked={filters.categories.includes(category.id)}
                          onCheckedChange={(checked) => {
                            const newCategories = checked
                              ? [...filters.categories, category.id]
                              : filters.categories.filter(c => c !== category.id);
                            updateFilters({ categories: newCategories });
                          }}
                        />
                        <label
                          htmlFor={category.id}
                          className="text-sm text-foreground flex-1 cursor-pointer"
                        >
                          {category.name} ({category.count})
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Brands */}
              <div className="space-y-3">
                <button
                  onClick={() => toggleSection('brands')}
                  className="flex items-center justify-between w-full text-sm font-medium text-foreground"
                >
                  Brands
                  <ChevronDown className={cn(
                    "w-4 h-4 transition-transform",
                    expandedSections.brands && "rotate-180"
                  )} />
                </button>
                
                {expandedSections.brands && (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {filterOptions?.brands.map((brand) => (
                      <div key={brand.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={brand.id}
                          checked={filters.brands.includes(brand.id)}
                          onCheckedChange={(checked) => {
                            const newBrands = checked
                              ? [...filters.brands, brand.id]
                              : filters.brands.filter(b => b !== brand.id);
                            updateFilters({ brands: newBrands });
                          }}
                        />
                        <label
                          htmlFor={brand.id}
                          className="text-sm text-foreground flex-1 cursor-pointer"
                        >
                          {brand.name} ({brand.count})
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
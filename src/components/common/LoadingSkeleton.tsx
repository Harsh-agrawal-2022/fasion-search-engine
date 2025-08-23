import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

const Skeleton = ({ className }: SkeletonProps) => (
  <div className={cn("skeleton", className)} />
);

export const ProductCardSkeleton = () => (
  <div className="product-card p-4 space-y-4">
    <Skeleton className="skeleton-image" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-6 w-1/4" />
    </div>
    <div className="flex justify-between items-center">
      <Skeleton className="h-4 w-16" />
      <Skeleton className="h-8 w-8 rounded-full" />
    </div>
  </div>
);

export const FilterSkeleton = () => (
  <div className="space-y-6">
    <div className="space-y-2">
      <Skeleton className="h-5 w-20" />
      <Skeleton className="h-8 w-full" />
    </div>
    <div className="space-y-2">
      <Skeleton className="h-5 w-16" />
      <div className="space-y-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center space-x-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const HeroSkeleton = () => (
  <div className="text-center space-y-6">
    <Skeleton className="h-12 w-3/4 mx-auto" />
    <Skeleton className="h-6 w-1/2 mx-auto" />
    <Skeleton className="h-12 w-40 mx-auto rounded-full" />
  </div>
);

export default Skeleton;
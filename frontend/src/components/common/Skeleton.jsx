const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg ${className}`} />
);

export const JobCardSkeleton = () => (
  <div className="card space-y-3">
    <Skeleton className="h-5 w-2/3" />
    <Skeleton className="h-4 w-1/2" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-8 w-24" />
  </div>
);

export default Skeleton;

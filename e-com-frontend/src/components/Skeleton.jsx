import React from 'react';

const Skeleton = ({ className = '' }) => {
  return (
    <div className={`animate-pulse bg-gray-200 rounded-md ${className}`}></div>
  );
};

export const ProductSkeleton = () => {
    return (
        <div className="flex flex-col gap-4">
            <Skeleton className="w-full h-80 lg:h-96" />
            <div className="flex flex-col gap-2">
                <Skeleton className="w-3/4 h-5" />
                <Skeleton className="w-1/2 h-5" />
            </div>
        </div>
    );
};

export default Skeleton;

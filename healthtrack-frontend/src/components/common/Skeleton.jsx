import React from 'react';

const Skeleton = ({ className }) => {
  return (
    <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded-xl ${className}`}></div>
  );
};

export const CardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-xl space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton className="h-12 w-12 rounded-xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-3 w-1/4" />
        </div>
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-4 w-4/6" />
    </div>
  );
};

export const TableRowSkeleton = () => {
  return (
    <div className="flex gap-4 items-center py-3 border-b border-gray-100 dark:border-gray-700">
      <Skeleton className="h-8 w-8 rounded-full" />
      <Skeleton className="h-4 flex-1" />
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-4 w-24" />
    </div>
  );
};

export default Skeleton;

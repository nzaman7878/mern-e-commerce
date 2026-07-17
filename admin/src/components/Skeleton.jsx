import React from 'react';

const Skeleton = ({ className = '' }) => {
  return (
    <div className={`animate-pulse bg-gray-200 rounded-md ${className}`}></div>
  );
};

export const TableRowSkeleton = () => {
    return (
        <tr>
            <td className="px-6 py-3"><Skeleton className="w-12 h-12" /></td>
            <td className="px-6 py-4"><Skeleton className="w-32 h-5" /></td>
            <td className="px-6 py-4"><Skeleton className="w-24 h-6" /></td>
            <td className="px-6 py-4"><Skeleton className="w-20 h-5" /></td>
            <td className="px-6 py-4 text-right"><Skeleton className="w-16 h-8 ml-auto" /></td>
        </tr>
    );
};

export default Skeleton;

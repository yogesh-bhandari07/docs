import React from "react";

const SkeletonLoader = () => {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-10 bg-gray-300 rounded-md w-full"></div>
      <div className="h-6 bg-gray-300 rounded-md w-3/4"></div>
      <div className="h-6 bg-gray-300 rounded-md w-2/4"></div>
      <div className="h-6 bg-gray-300 rounded-md w-full"></div>
    </div>
  );
};

export default SkeletonLoader;

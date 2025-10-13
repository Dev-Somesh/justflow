import React from "react";

export const LoadingState: React.FC = () => (
  <div className="flex items-center justify-center h-32">
    <span className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></span>
    <span className="ml-4 text-gray-600">Loading...</span>
  </div>
);

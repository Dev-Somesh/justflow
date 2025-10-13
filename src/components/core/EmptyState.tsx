import React from "react";

interface EmptyStateProps {
  message?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  message = "No data available.",
}) => (
  <div className="flex flex-col items-center justify-center h-32 text-gray-500">
    <svg width="48" height="48" fill="none" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" stroke="#cbd5e1" strokeWidth="2" />
      <path d="M8 12h8M12 8v8" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
    </svg>
    <span className="mt-2">{message}</span>
  </div>
);

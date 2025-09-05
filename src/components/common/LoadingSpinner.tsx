import React from "react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  className = "",
}) => {
  const sizeClasses: Record<typeof size, string> = {
    sm: "h-5 w-5",
    md: "h-10 w-10",
    lg: "h-16 w-16",
  };

  return (
    <div
      className={`relative ${sizeClasses[size]} ${className}`}
    >
      {/* Outer ring */}
      <div
        className="absolute inset-0 rounded-full border-4 border-gray-200 animate-spin"
        style={{ borderTopColor: "transparent" }}
      />

      {/* Inner pulsing dot */}
      <div
        className="absolute inset-2 rounded-full bg-blue-500 animate-ping"
      />

      {/* Center dot */}
      <div
        className="absolute inset-3 rounded-full bg-blue-600"
      />
    </div>
  );
};

"use client";

import { useLoading } from "@/context/LoadingContext";

interface LoadingOverlayProps {
  children: React.ReactNode;
  showSpinner?: boolean;
  translucentBg?: boolean;
  disableGlobalLoading?: boolean;
  isLoading?: boolean; // For manual control
}

export default function LoadingOverlay({
  children,
  showSpinner = true,
  translucentBg = true,
  disableGlobalLoading = false,
  isLoading: manualLoading,
}: LoadingOverlayProps) {
  const { isLoading: globalLoading } = useLoading();

  const isLoading =
    manualLoading !== undefined
      ? manualLoading
      : disableGlobalLoading
      ? false
      : globalLoading;

  return (
    <div className="relative">
      {children}

      {isLoading && (
        <div
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 z-10 ${
            translucentBg ? "bg-white/80 backdrop-blur-sm" : "bg-white"
          }`}
        >
          {showSpinner && (
            <div className="relative">
              {/* Outer ring */}
              <div className="w-12 h-12 rounded-full border-4 border-t-blue-500 border-r-transparent border-b-indigo-600 border-l-transparent animate-spin"></div>

              {/* Inner ring */}
              <div className="absolute top-1 left-1 w-10 h-10 rounded-full border-4 border-t-transparent border-r-indigo-600 border-b-transparent border-l-blue-500 animate-spin-slow"></div>

              {/* Center dot */}
              <div className="absolute top-5 left-5 w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600"></div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

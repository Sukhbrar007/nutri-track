"use client";

import { useLoading } from "@/context/LoadingContext";
import { useEffect, useState } from "react";

export default function GlobalLoadingBar() {
  const { isLoading } = useLoading();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let timer: NodeJS.Timeout;

    if (isLoading) {
      setProgress(0);

      // Quickly increment to 80% to simulate a fast initial load
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev < 80) {
            return prev + (80 - prev) / 10;
          }
          clearInterval(interval);
          return prev;
        });
      }, 100);

      return () => clearInterval(interval);
    } else {
      // When loading completes, finish the progress bar quickly
      setProgress(100);

      // Then hide the bar after animation completes
      timer = setTimeout(() => {
        setProgress(0);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  if (progress === 0 && !isLoading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div
        className="h-1 bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 transition-all duration-300 ease-out"
        style={{
          width: `${progress}%`,
          opacity: progress === 100 ? 0 : 1,
          transition:
            progress === 100
              ? "width 0.3s ease-out, opacity 0.3s ease-out"
              : "width 0.3s ease-out",
        }}
      />
    </div>
  );
}

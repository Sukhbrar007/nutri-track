"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function LoadingBar() {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const startLoading = () => {
      setLoading(true);
      setProgress(0);

      // Simulate progress
      interval = setInterval(() => {
        setProgress((prev) => {
          // Move quickly to 30%
          if (prev < 30) return prev + 5;

          // Move more slowly to 90%
          if (prev < 90) return prev + (90 - prev) / 10;

          // Stop at 90% until actually loaded
          return 90;
        });
      }, 100);
    };

    const stopLoading = () => {
      setProgress(100);

      // Clear interval
      if (interval) clearInterval(interval);

      // Reset after animation completes
      setTimeout(() => {
        setLoading(false);
        setProgress(0);
      }, 500);
    };

    startLoading();

    // Simulate completion after a delay
    const timeout = setTimeout(() => {
      stopLoading();
    }, 1000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [pathname, searchParams]);

  if (!loading && progress === 0) return null;

  return (
    <>
      <div className="loading-bar" style={{ width: `${progress}%` }} />
      <div className="loading-percentage">{Math.round(progress)}%</div>
    </>
  );
}

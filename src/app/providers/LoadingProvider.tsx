"use client";

import { ReactNode, useState, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { LoadingContext } from "@/context/LoadingContext";

function LoadingProviderContent({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Start loading
    const handleStart = () => {
      setIsLoading(true);
    };

    // End loading
    const handleStop = () => {
      setIsLoading(false);
    };

    // When pathname or searchParams changes, set loading to true
    handleStart();

    // Then set a small delay to simulate loading and ensure UI updates
    const timeout = setTimeout(() => {
      handleStop();
    }, 600);

    return () => clearTimeout(timeout);
  }, [pathname, searchParams]);

  return (
    <LoadingContext.Provider value={{ isLoading }}>
      {children}
    </LoadingContext.Provider>
  );
}

export default function LoadingProvider({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={null}>
      <LoadingProviderContent>{children}</LoadingProviderContent>
    </Suspense>
  );
}

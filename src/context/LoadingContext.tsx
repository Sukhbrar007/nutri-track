"use client";

import { createContext, useContext } from "react";

interface LoadingContextType {
  isLoading: boolean;
}

const LoadingContext = createContext<LoadingContextType>({ isLoading: false });

export const useLoading = () => useContext(LoadingContext);

export { LoadingContext };

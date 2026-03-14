import type { ScanResult } from "@/types";
import { type ReactNode, createContext, useContext, useState } from "react";

interface ScanContextValue {
  capturedImages: File[];
  setCapturedImages: (images: File[]) => void;
  scanResult: ScanResult | null;
  setScanResult: (result: ScanResult | null) => void;
}

const ScanContext = createContext<ScanContextValue | null>(null);

export function ScanProvider({ children }: { children: ReactNode }) {
  const [capturedImages, setCapturedImages] = useState<File[]>([]);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);

  return (
    <ScanContext.Provider
      value={{ capturedImages, setCapturedImages, scanResult, setScanResult }}
    >
      {children}
    </ScanContext.Provider>
  );
}

export function useScanContext() {
  const ctx = useContext(ScanContext);
  if (!ctx) throw new Error("useScanContext must be used within ScanProvider");
  return ctx;
}

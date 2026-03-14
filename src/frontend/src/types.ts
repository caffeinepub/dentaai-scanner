export type ToothStatus = "healthy" | "risk" | "cavity";

export interface ToothRecord {
  number: bigint;
  status: ToothStatus;
  condition: string;
  recommendation: string;
}

export interface ScanResult {
  teeth: ToothRecord[];
  overallScore: bigint;
  timestamp: bigint;
}

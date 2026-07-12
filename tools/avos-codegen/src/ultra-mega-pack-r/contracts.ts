export type UltraRPrimitive = string | number | boolean | null;
export type UltraRValue =
  | UltraRPrimitive
  | UltraRValue[]
  | { [key: string]: UltraRValue };

export enum UltraRSeverity {
  INFO = "info",
  WARNING = "warning",
  ERROR = "error",
  CRITICAL = "critical",
}

export enum UltraRStatus {
  READY = "ready",
  DEGRADED = "degraded",
  BLOCKED = "blocked",
}

export interface UltraRFinding {
  code: string;
  severity: UltraRSeverity;
  message: string;
  subject?: string;
  metadata: Record<string, UltraRValue>;
}

export interface UltraREvidence {
  id: string;
  systemKey: string;
  category: string;
  action: string;
  message: string;
  metadata: Record<string, UltraRValue>;
  createdAt: string;
}

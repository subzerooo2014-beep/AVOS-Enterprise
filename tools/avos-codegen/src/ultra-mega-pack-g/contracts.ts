export type UltraGPrimitive = string | number | boolean | null;
export type UltraGValue =
  | UltraGPrimitive
  | UltraGValue[]
  | { [key: string]: UltraGValue };

export enum UltraGSeverity {
  INFO = "info",
  WARNING = "warning",
  ERROR = "error",
  CRITICAL = "critical",
}

export enum UltraGStatus {
  READY = "ready",
  DEGRADED = "degraded",
  BLOCKED = "blocked",
}

export interface UltraGFinding {
  code: string;
  severity: UltraGSeverity;
  message: string;
  subject?: string;
  metadata: Record<string, UltraGValue>;
}

export interface UltraGEvidence {
  id: string;
  systemKey: string;
  category: string;
  action: string;
  message: string;
  metadata: Record<string, UltraGValue>;
  createdAt: string;
}

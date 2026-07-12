export type UltraLPrimitive = string | number | boolean | null;
export type UltraLValue =
  | UltraLPrimitive
  | UltraLValue[]
  | { [key: string]: UltraLValue };

export enum UltraLSeverity {
  INFO = "info",
  WARNING = "warning",
  ERROR = "error",
  CRITICAL = "critical",
}

export enum UltraLStatus {
  READY = "ready",
  DEGRADED = "degraded",
  BLOCKED = "blocked",
}

export interface UltraLFinding {
  code: string;
  severity: UltraLSeverity;
  message: string;
  subject?: string;
  metadata: Record<string, UltraLValue>;
}

export interface UltraLEvidence {
  id: string;
  systemKey: string;
  category: string;
  action: string;
  message: string;
  metadata: Record<string, UltraLValue>;
  createdAt: string;
}

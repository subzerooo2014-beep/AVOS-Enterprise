export type UltraEPrimitive = string | number | boolean | null;
export type UltraEValue =
  | UltraEPrimitive
  | UltraEValue[]
  | { [key: string]: UltraEValue };

export enum UltraESeverity {
  INFO = "info",
  WARNING = "warning",
  ERROR = "error",
  CRITICAL = "critical",
}

export enum UltraEStatus {
  READY = "ready",
  DEGRADED = "degraded",
  BLOCKED = "blocked",
}

export interface UltraEFinding {
  code: string;
  severity: UltraESeverity;
  message: string;
  subject?: string;
  metadata: Record<string, UltraEValue>;
}

export interface UltraEEvidence {
  id: string;
  systemKey: string;
  category: string;
  action: string;
  message: string;
  metadata: Record<string, UltraEValue>;
  createdAt: string;
}

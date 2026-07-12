export type UltraOPrimitive = string | number | boolean | null;
export type UltraOValue =
  | UltraOPrimitive
  | UltraOValue[]
  | { [key: string]: UltraOValue };

export enum UltraOSeverity {
  INFO = "info",
  WARNING = "warning",
  ERROR = "error",
  CRITICAL = "critical",
}

export enum UltraOStatus {
  READY = "ready",
  DEGRADED = "degraded",
  BLOCKED = "blocked",
}

export interface UltraOFinding {
  code: string;
  severity: UltraOSeverity;
  message: string;
  subject?: string;
  metadata: Record<string, UltraOValue>;
}

export interface UltraOEvidence {
  id: string;
  systemKey: string;
  category: string;
  action: string;
  message: string;
  metadata: Record<string, UltraOValue>;
  createdAt: string;
}

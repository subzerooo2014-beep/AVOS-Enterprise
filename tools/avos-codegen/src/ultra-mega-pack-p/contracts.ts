export type UltraPPrimitive = string | number | boolean | null;
export type UltraPValue =
  | UltraPPrimitive
  | UltraPValue[]
  | { [key: string]: UltraPValue };

export enum UltraPSeverity {
  INFO = "info",
  WARNING = "warning",
  ERROR = "error",
  CRITICAL = "critical",
}

export enum UltraPStatus {
  READY = "ready",
  DEGRADED = "degraded",
  BLOCKED = "blocked",
}

export interface UltraPFinding {
  code: string;
  severity: UltraPSeverity;
  message: string;
  subject?: string;
  metadata: Record<string, UltraPValue>;
}

export interface UltraPEvidence {
  id: string;
  systemKey: string;
  category: string;
  action: string;
  message: string;
  metadata: Record<string, UltraPValue>;
  createdAt: string;
}

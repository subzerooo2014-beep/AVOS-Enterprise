export type UltraQPrimitive = string | number | boolean | null;
export type UltraQValue =
  | UltraQPrimitive
  | UltraQValue[]
  | { [key: string]: UltraQValue };

export enum UltraQSeverity {
  INFO = "info",
  WARNING = "warning",
  ERROR = "error",
  CRITICAL = "critical",
}

export enum UltraQStatus {
  READY = "ready",
  DEGRADED = "degraded",
  BLOCKED = "blocked",
}

export interface UltraQFinding {
  code: string;
  severity: UltraQSeverity;
  message: string;
  subject?: string;
  metadata: Record<string, UltraQValue>;
}

export interface UltraQEvidence {
  id: string;
  systemKey: string;
  category: string;
  action: string;
  message: string;
  metadata: Record<string, UltraQValue>;
  createdAt: string;
}

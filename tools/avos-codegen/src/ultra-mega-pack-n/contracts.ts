export type UltraNPrimitive = string | number | boolean | null;
export type UltraNValue =
  | UltraNPrimitive
  | UltraNValue[]
  | { [key: string]: UltraNValue };

export enum UltraNSeverity {
  INFO = "info",
  WARNING = "warning",
  ERROR = "error",
  CRITICAL = "critical",
}

export enum UltraNStatus {
  READY = "ready",
  DEGRADED = "degraded",
  BLOCKED = "blocked",
}

export interface UltraNFinding {
  code: string;
  severity: UltraNSeverity;
  message: string;
  subject?: string;
  metadata: Record<string, UltraNValue>;
}

export interface UltraNEvidence {
  id: string;
  systemKey: string;
  category: string;
  action: string;
  message: string;
  metadata: Record<string, UltraNValue>;
  createdAt: string;
}

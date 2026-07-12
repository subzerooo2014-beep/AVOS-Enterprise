export type UltraJPrimitive = string | number | boolean | null;
export type UltraJValue =
  | UltraJPrimitive
  | UltraJValue[]
  | { [key: string]: UltraJValue };

export enum UltraJSeverity {
  INFO = "info",
  WARNING = "warning",
  ERROR = "error",
  CRITICAL = "critical",
}

export enum UltraJStatus {
  READY = "ready",
  DEGRADED = "degraded",
  BLOCKED = "blocked",
}

export interface UltraJFinding {
  code: string;
  severity: UltraJSeverity;
  message: string;
  subject?: string;
  metadata: Record<string, UltraJValue>;
}

export interface UltraJEvidence {
  id: string;
  systemKey: string;
  category: string;
  action: string;
  message: string;
  metadata: Record<string, UltraJValue>;
  createdAt: string;
}

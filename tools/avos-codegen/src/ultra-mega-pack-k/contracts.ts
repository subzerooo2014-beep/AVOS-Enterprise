export type UltraKPrimitive = string | number | boolean | null;
export type UltraKValue =
  | UltraKPrimitive
  | UltraKValue[]
  | { [key: string]: UltraKValue };

export enum UltraKSeverity {
  INFO = "info",
  WARNING = "warning",
  ERROR = "error",
  CRITICAL = "critical",
}

export enum UltraKStatus {
  READY = "ready",
  DEGRADED = "degraded",
  BLOCKED = "blocked",
}

export interface UltraKFinding {
  code: string;
  severity: UltraKSeverity;
  message: string;
  subject?: string;
  metadata: Record<string, UltraKValue>;
}

export interface UltraKEvidence {
  id: string;
  systemKey: string;
  category: string;
  action: string;
  message: string;
  metadata: Record<string, UltraKValue>;
  createdAt: string;
}

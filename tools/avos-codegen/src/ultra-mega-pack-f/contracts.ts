export type UltraFPrimitive = string | number | boolean | null;
export type UltraFValue =
  | UltraFPrimitive
  | UltraFValue[]
  | { [key: string]: UltraFValue };

export enum UltraFSeverity {
  INFO = "info",
  WARNING = "warning",
  ERROR = "error",
  CRITICAL = "critical",
}

export enum UltraFStatus {
  READY = "ready",
  DEGRADED = "degraded",
  BLOCKED = "blocked",
}

export interface UltraFFinding {
  code: string;
  severity: UltraFSeverity;
  message: string;
  subject?: string;
  metadata: Record<string, UltraFValue>;
}

export interface UltraFEvidence {
  id: string;
  systemKey: string;
  category: string;
  action: string;
  message: string;
  metadata: Record<string, UltraFValue>;
  createdAt: string;
}

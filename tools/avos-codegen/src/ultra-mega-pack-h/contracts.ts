export type UltraHPrimitive = string | number | boolean | null;
export type UltraHValue =
  | UltraHPrimitive
  | UltraHValue[]
  | { [key: string]: UltraHValue };

export enum UltraHSeverity {
  INFO = "info",
  WARNING = "warning",
  ERROR = "error",
  CRITICAL = "critical",
}

export enum UltraHStatus {
  READY = "ready",
  DEGRADED = "degraded",
  BLOCKED = "blocked",
}

export interface UltraHFinding {
  code: string;
  severity: UltraHSeverity;
  message: string;
  subject?: string;
  metadata: Record<string, UltraHValue>;
}

export interface UltraHEvidence {
  id: string;
  systemKey: string;
  category: string;
  action: string;
  message: string;
  metadata: Record<string, UltraHValue>;
  createdAt: string;
}

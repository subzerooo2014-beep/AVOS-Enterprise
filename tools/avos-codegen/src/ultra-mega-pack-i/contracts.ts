export type UltraIPrimitive = string | number | boolean | null;
export type UltraIValue =
  | UltraIPrimitive
  | UltraIValue[]
  | { [key: string]: UltraIValue };

export enum UltraISeverity {
  INFO = "info",
  WARNING = "warning",
  ERROR = "error",
  CRITICAL = "critical",
}

export enum UltraIStatus {
  READY = "ready",
  DEGRADED = "degraded",
  BLOCKED = "blocked",
}

export interface UltraIFinding {
  code: string;
  severity: UltraISeverity;
  message: string;
  subject?: string;
  metadata: Record<string, UltraIValue>;
}

export interface UltraIEvidence {
  id: string;
  systemKey: string;
  category: string;
  action: string;
  message: string;
  metadata: Record<string, UltraIValue>;
  createdAt: string;
}

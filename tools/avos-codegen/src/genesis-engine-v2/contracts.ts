export type GenesisPrimitive = string | number | boolean | null;
export type GenesisValue =
  | GenesisPrimitive
  | GenesisValue[]
  | { [key: string]: GenesisValue };

export enum GenesisStatus {
  READY = "ready",
  DEGRADED = "degraded",
  BLOCKED = "blocked",
}

export enum GenesisSeverity {
  INFO = "info",
  WARNING = "warning",
  ERROR = "error",
  CRITICAL = "critical",
}

export interface GenesisFinding {
  code: string;
  severity: GenesisSeverity;
  message: string;
  subject?: string;
  metadata: Record<string, GenesisValue>;
}

export interface GenesisEvidence {
  id: string;
  category: string;
  action: string;
  message: string;
  metadata: Record<string, GenesisValue>;
  createdAt: string;
}

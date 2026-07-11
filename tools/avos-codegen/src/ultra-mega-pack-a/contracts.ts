export type UltraPrimitive =
  | string
  | number
  | boolean
  | null;

export type UltraValue =
  | UltraPrimitive
  | UltraValue[]
  | {
      [key: string]: UltraValue;
    };

export enum UltraSeverity {
  INFO = "info",
  WARNING = "warning",
  ERROR = "error",
  CRITICAL = "critical",
}

export enum UltraDecision {
  APPROVE = "approve",
  APPROVE_WITH_CONTROLS = "approve_with_controls",
  REQUIRE_REVIEW = "require_review",
  REJECT = "reject",
}

export interface UltraFinding {
  code: string;
  severity: UltraSeverity;
  message: string;
  subject?: string;
  metadata: Record<string, UltraValue>;
}

export interface UltraEvidenceEntry {
  id: string;
  category: string;
  action: string;
  message: string;
  metadata: Record<string, UltraValue>;
  createdAt: string;
}

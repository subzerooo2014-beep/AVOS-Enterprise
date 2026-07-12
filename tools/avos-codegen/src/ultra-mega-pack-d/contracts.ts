export type UltraDPrimitive = string | number | boolean | null;
export type UltraDValue =
  | UltraDPrimitive
  | UltraDValue[]
  | { [key: string]: UltraDValue };

export enum UltraDSeverity {
  INFO = "info",
  WARNING = "warning",
  ERROR = "error",
  CRITICAL = "critical",
}

export enum UltraDDecision {
  APPROVE = "approve",
  APPROVE_WITH_CONTROLS = "approve_with_controls",
  REQUIRE_REVIEW = "require_review",
  REJECT = "reject",
}

export interface UltraDFinding {
  code: string;
  severity: UltraDSeverity;
  message: string;
  subject?: string;
  metadata: Record<string, UltraDValue>;
}

export interface UltraDEvidence {
  id: string;
  systemKey: string;
  category: string;
  action: string;
  message: string;
  metadata: Record<string, UltraDValue>;
  createdAt: string;
}

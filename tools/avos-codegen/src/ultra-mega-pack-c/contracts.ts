export type UltraCPrimitive = string | number | boolean | null;
export type UltraCValue =
  | UltraCPrimitive
  | UltraCValue[]
  | { [key: string]: UltraCValue };

export enum UltraCSeverity {
  INFO = "info",
  WARNING = "warning",
  ERROR = "error",
  CRITICAL = "critical",
}

export enum UltraCDecision {
  APPROVE = "approve",
  APPROVE_WITH_CONTROLS = "approve_with_controls",
  REQUIRE_REVIEW = "require_review",
  REJECT = "reject",
}

export interface UltraCFinding {
  code: string;
  severity: UltraCSeverity;
  message: string;
  subject?: string;
  metadata: Record<string, UltraCValue>;
}

export interface UltraCEvidence {
  id: string;
  systemKey: string;
  category: string;
  action: string;
  message: string;
  metadata: Record<string, UltraCValue>;
  createdAt: string;
}

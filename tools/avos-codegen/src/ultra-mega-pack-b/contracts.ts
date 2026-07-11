export type UltraBPrimitive =
  | string
  | number
  | boolean
  | null;

export type UltraBValue =
  | UltraBPrimitive
  | UltraBValue[]
  | {
      [key: string]: UltraBValue;
    };

export enum UltraBSeverity {
  INFO = "info",
  WARNING = "warning",
  ERROR = "error",
  CRITICAL = "critical",
}

export enum UltraBDecision {
  APPROVE = "approve",
  APPROVE_WITH_CONTROLS = "approve_with_controls",
  REQUIRE_REVIEW = "require_review",
  REJECT = "reject",
}

export interface UltraBFinding {
  code: string;
  severity: UltraBSeverity;
  message: string;
  subject?: string;
  metadata: Record<string, UltraBValue>;
}

export interface UltraBEvidence {
  id: string;
  systemKey: string;
  category: string;
  action: string;
  message: string;
  metadata: Record<string, UltraBValue>;
  createdAt: string;
}

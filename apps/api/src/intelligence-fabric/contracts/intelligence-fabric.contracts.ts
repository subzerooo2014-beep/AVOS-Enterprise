export type IntelligenceStatus =
  | "idle"
  | "analyzing"
  | "completed"
  | "failed";

export interface IntelligenceContext {
  readonly tenantId?: string;
  readonly actorId?: string;
  readonly correlationId?: string;
  readonly locale?: string;
  readonly metadata?: Readonly<Record<string, unknown>>;
}

export interface IntelligenceSignal {
  readonly id: string;
  readonly type: string;
  readonly source: string;
  readonly value: unknown;
  readonly confidence: number;
  readonly observedAt: string;
  readonly metadata?: Readonly<Record<string, unknown>>;
}

export interface IntelligenceRequest {
  readonly objective: string;
  readonly context?: IntelligenceContext;
  readonly signals?: readonly IntelligenceSignal[];
  readonly constraints?: readonly string[];
}

export interface IntelligenceInsight {
  readonly id: string;
  readonly title: string;
  readonly summary: string;
  readonly confidence: number;
  readonly priority: "low" | "medium" | "high" | "critical";
  readonly evidenceIds: readonly string[];
  readonly generatedAt: string;
}

export interface IntelligenceDecision {
  readonly id: string;
  readonly objective: string;
  readonly recommendation: string;
  readonly rationale: readonly string[];
  readonly confidence: number;
  readonly requiresHumanApproval: boolean;
  readonly insights: readonly IntelligenceInsight[];
  readonly createdAt: string;
}

export interface IntelligenceRuntimeSnapshot {
  readonly status: IntelligenceStatus;
  readonly activeAnalyses: number;
  readonly completedAnalyses: number;
  readonly failedAnalyses: number;
  readonly version: string;
  readonly lastActivityAt: string;
}

export interface IntelligenceVerificationResult {
  readonly id: string;
  readonly status: "passed" | "failed";
  readonly score: number;
  readonly checks: Readonly<Record<string, boolean>>;
  readonly findings: readonly string[];
  readonly verifiedAt: string;
}
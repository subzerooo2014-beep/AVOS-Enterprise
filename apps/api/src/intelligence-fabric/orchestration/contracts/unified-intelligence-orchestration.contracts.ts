export type IntelligenceEngineHealth =
  | "healthy"
  | "degraded"
  | "unavailable";

export type IntelligenceEnginePriority =
  | "low"
  | "normal"
  | "high"
  | "critical";

export interface IntelligenceEngineDescriptor {
  readonly id: string;
  readonly name: string;
  readonly domain: string;
  readonly version: string;
  readonly capabilities: readonly string[];
  readonly priority: IntelligenceEnginePriority;
  readonly health: IntelligenceEngineHealth;
  readonly enabled: boolean;
  readonly metadata?: Readonly<Record<string, unknown>>;
  readonly registeredAt: string;
}

export interface UnifiedIntelligenceRequest {
  readonly objective: string;
  readonly domain?: string;
  readonly capability?: string;
  readonly context?: Readonly<Record<string, unknown>>;
  readonly evidence?: readonly UnifiedIntelligenceEvidence[];
  readonly preferredEngineId?: string;
  readonly constraints?: readonly string[];
  readonly requireHumanApproval?: boolean;
}

export interface UnifiedIntelligenceEvidence {
  readonly id: string;
  readonly source: string;
  readonly title: string;
  readonly content: string;
  readonly trustScore: number;
  readonly metadata?: Readonly<Record<string, unknown>>;
}

export interface IntelligenceEngineResult {
  readonly engineId: string;
  readonly recommendation: string;
  readonly confidence: number;
  readonly rationale: readonly string[];
  readonly evidenceIds: readonly string[];
  readonly durationMs: number;
  readonly generatedAt: string;
}

export interface UnifiedIntelligenceDecision {
  readonly id: string;
  readonly correlationId: string;
  readonly objective: string;
  readonly selectedEngines: readonly string[];
  readonly recommendation: string;
  readonly confidence: number;
  readonly rationale: readonly string[];
  readonly conflicts: readonly string[];
  readonly requiresHumanApproval: boolean;
  readonly engineResults: readonly IntelligenceEngineResult[];
  readonly createdAt: string;
}

export interface UnifiedIntelligenceRoute {
  readonly correlationId: string;
  readonly selectedEngineIds: readonly string[];
  readonly rejectedEngineIds: readonly string[];
  readonly reason: string;
  readonly routedAt: string;
}

export interface IntelligenceOrchestrationVerificationResult {
  readonly id: string;
  readonly status: "passed" | "failed";
  readonly score: number;
  readonly checks: Readonly<Record<string, boolean>>;
  readonly findings: readonly string[];
  readonly verifiedAt: string;
}
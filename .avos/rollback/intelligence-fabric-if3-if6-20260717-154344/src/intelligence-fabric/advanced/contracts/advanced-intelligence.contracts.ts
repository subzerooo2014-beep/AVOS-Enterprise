export type LearningOutcome = "success" | "partial" | "failure";
export type AgentStatus = "idle" | "running" | "blocked" | "completed";
export type DecisionRisk = "low" | "medium" | "high" | "critical";

export interface AdaptiveLearningSignal {
  readonly id: string;
  readonly objective: string;
  readonly engineId: string;
  readonly domain: string;
  readonly confidence: number;
  readonly outcome: LearningOutcome;
  readonly reward: number;
  readonly latencyMs: number;
  readonly createdAt: string;
}

export interface EngineLearningProfile {
  readonly engineId: string;
  readonly samples: number;
  readonly successRate: number;
  readonly averageConfidence: number;
  readonly averageReward: number;
  readonly averageLatencyMs: number;
  readonly adaptiveWeight: number;
  readonly updatedAt: string;
}

export interface AdaptiveCoordinationRequest {
  readonly objective: string;
  readonly domain?: string;
  readonly capability?: string;
  readonly context?: Readonly<Record<string, unknown>>;
  readonly requireHumanApproval?: boolean;
}

export interface AdaptiveCoordinationResult {
  readonly id: string;
  readonly selectedEngineIds: readonly string[];
  readonly weights: Readonly<Record<string, number>>;
  readonly recommendation: string;
  readonly confidence: number;
  readonly requiresHumanApproval: boolean;
  readonly createdAt: string;
}

export interface IntelligenceAgentDescriptor {
  readonly id: string;
  readonly name: string;
  readonly role: string;
  readonly capabilities: readonly string[];
  readonly status: AgentStatus;
  readonly priority: number;
  readonly enabled: boolean;
}

export interface AgentTask {
  readonly id: string;
  readonly objective: string;
  readonly assignedAgentId: string;
  readonly status: AgentStatus;
  readonly output?: Readonly<Record<string, unknown>>;
  readonly createdAt: string;
  readonly completedAt?: string;
}

export interface EnterpriseDecisionRequest {
  readonly objective: string;
  readonly domain: string;
  readonly options: readonly string[];
  readonly risk: DecisionRisk;
  readonly evidenceScore?: number;
  readonly requireHumanApproval?: boolean;
}

export interface EnterpriseDecisionRecord {
  readonly id: string;
  readonly objective: string;
  readonly selectedOption: string;
  readonly score: number;
  readonly confidence: number;
  readonly risk: DecisionRisk;
  readonly rationale: readonly string[];
  readonly requiresHumanApproval: boolean;
  readonly createdAt: string;
}

export interface IntelligenceEvolutionSnapshot {
  readonly version: string;
  readonly maturityScore: number;
  readonly learningProfiles: number;
  readonly agents: number;
  readonly decisions: number;
  readonly certificationStatus: string;
  readonly generatedAt: string;
}
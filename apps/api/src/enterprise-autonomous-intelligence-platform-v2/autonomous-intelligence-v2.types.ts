export interface IntelligenceAgentV2 {
  id: string;
  name: string;
  role: string;
  status: "ACTIVE" | "PAUSED" | "RETIRED";
  capabilities: string[];
  authorityLevel: number;
  createdAt: string;
  updatedAt: string;
}

export interface IntelligencePlanV2 {
  id: string;
  objective: string;
  status: "DRAFT" | "ACTIVE" | "COMPLETED" | "FAILED";
  steps: string[];
  currentStep?: string;
  agentIds: string[];
  context: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  error?: string;
}

export interface IntelligenceDecisionV2 {
  id: string;
  planId: string;
  action: string;
  outcome: "ALLOW" | "REVIEW" | "DENY";
  confidence: number;
  rationale: string[];
  createdAt: string;
}

export interface AgentCollaborationV2 {
  id: string;
  senderId: string;
  receiverId: string;
  topic: string;
  payload: Record<string, unknown>;
  createdAt: string;
}

export interface IntelligenceLearningV2 {
  id: string;
  sourceId: string;
  lesson: string;
  score: number;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export interface PredictiveIntelligenceV2 {
  id: string;
  category: string;
  score: number;
  confidence: number;
  summary: string;
  factors: string[];
  createdAt: string;
}

export interface AutonomousIntelligenceMetricsV2 {
  agents: number;
  activeAgents: number;
  plans: number;
  activePlans: number;
  failedPlans: number;
  decisions: number;
  collaborations: number;
  learnings: number;
  predictions: number;
}

export interface AutonomousIntelligenceHealthV2 {
  success: boolean;
  system: string;
  version: string;
  status: "READY" | "DEGRADED";
  metrics: AutonomousIntelligenceMetricsV2;
  components: Record<string, string>;
}

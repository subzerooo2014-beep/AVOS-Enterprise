export type FactoryKnowledgeType =
  | "blueprint"
  | "capability"
  | "decision"
  | "execution"
  | "failure"
  | "recovery"
  | "optimization";

export type LearningSignalType =
  | "success"
  | "failure"
  | "latency"
  | "quality"
  | "resource"
  | "governance";

export type RecoveryStatus =
  | "proposed"
  | "awaiting-approval"
  | "approved"
  | "executing"
  | "completed"
  | "rejected";

export interface FactoryKnowledgeRecord {
  id: string;
  type: FactoryKnowledgeType;
  sourceId: string;
  title: string;
  summary: string;
  tags: string[];
  trustScore: number;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductionMemoryRecord {
  id: string;
  workItemId: string;
  stage: string;
  outcome: "success" | "failure" | "partial";
  qualityScore: number;
  durationMs: number;
  resourceUnits: number;
  decisionIds: string[];
  timestamp: string;
  metadata: Record<string, unknown>;
}

export interface LearningSignal {
  id: string;
  workItemId?: string;
  type: LearningSignalType;
  value: number;
  weight: number;
  context: Record<string, unknown>;
  timestamp: string;
}

export interface FactoryPattern {
  id: string;
  name: string;
  category: "success" | "failure" | "bottleneck" | "recovery";
  confidence: number;
  evidenceCount: number;
  recommendation: string;
  createdAt: string;
}

export interface FactoryEvolutionProposal {
  id: string;
  targetType: "factory" | "blueprint" | "capability" | "workflow";
  targetId: string;
  title: string;
  rationale: string;
  expectedImpact: number;
  riskScore: number;
  status: "proposed" | "approved" | "rejected" | "implemented";
  approvedBy?: string;
  createdAt: string;
}

export interface FailurePrediction {
  id: string;
  targetId: string;
  probability: number;
  severity: "low" | "medium" | "high" | "critical";
  likelyCause: string;
  preventiveAction: string;
  createdAt: string;
}

export interface RootCauseAnalysis {
  id: string;
  workItemId: string;
  rootCause: string;
  contributingFactors: string[];
  evidence: string[];
  confidence: number;
  recommendedRecovery: string[];
  createdAt: string;
}

export interface RecoveryPlan {
  id: string;
  workItemId: string;
  status: RecoveryStatus;
  actions: string[];
  requiresHumanApproval: true;
  approvedBy?: string;
  executionLog: string[];
  createdAt: string;
  updatedAt: string;
}

export interface FactoryDigitalDna {
  id: string;
  entityType: "factory" | "blueprint" | "capability" | "workflow";
  entityId: string;
  purpose: string;
  dependencies: string[];
  policies: string[];
  metrics: string[];
  versionHistory: string[];
  evolutionHistory: string[];
  trustScore: number;
  createdAt: string;
}

export interface FactoryGraphNode {
  id: string;
  type: string;
  label: string;
  metadata: Record<string, unknown>;
}

export interface FactoryGraphEdge {
  id: string;
  source: string;
  target: string;
  relation: string;
  weight: number;
}

export interface ExecutiveFactoryIntelligence {
  knowledgeRecords: number;
  memoryRecords: number;
  learningSignals: number;
  detectedPatterns: number;
  evolutionProposals: number;
  predictions: number;
  recoveryPlans: number;
  graphNodes: number;
  graphEdges: number;
  factoryHealthScore: number;
  learningMaturityScore: number;
  selfHealingReadinessScore: number;
}

export interface FactoryUltraVerification {
  classification: "factory-knowledge-learning-evolution-self-healing";
  version: "30.0.0";
  healthy: boolean;
  humanFinalAuthority: true;
  packs: number[];
  capabilities: string[];
  intelligence: ExecutiveFactoryIntelligence;
}

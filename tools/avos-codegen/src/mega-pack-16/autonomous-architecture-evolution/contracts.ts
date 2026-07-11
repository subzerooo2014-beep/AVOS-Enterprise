export type ArchitecturePrimitive =
  | string
  | number
  | boolean
  | null;

export type ArchitectureValue =
  | ArchitecturePrimitive
  | ArchitectureValue[]
  | {
      [key: string]: ArchitectureValue;
    };

export enum ArchitectureNodeKind {
  MODULE = "module",
  SERVICE = "service",
  CONTROLLER = "controller",
  WORKER = "worker",
  DATABASE = "database",
  EVENT_BUS = "event_bus",
  EXTERNAL_SYSTEM = "external_system",
  POLICY = "policy",
}

export enum ArchitectureMutationType {
  ADD = "add",
  REMOVE = "remove",
  REPLACE = "replace",
  SPLIT = "split",
  MERGE = "merge",
  UPGRADE = "upgrade",
  ISOLATE = "isolate",
  REWIRE = "rewire",
}

export enum ArchitectureSeverity {
  INFO = "info",
  WARNING = "warning",
  ERROR = "error",
  CRITICAL = "critical",
}

export enum ArchitectureEvolutionDecision {
  APPROVE = "approve",
  APPROVE_WITH_CONTROLS = "approve_with_controls",
  REQUIRE_REVIEW = "require_review",
  REJECT = "reject",
}

export interface ArchitectureNode {
  key: string;
  name: string;
  kind: ArchitectureNodeKind;
  version: string;
  capabilities: string[];
  dependencies: string[];
  criticality: number;
  complexity: number;
  maintainability: number;
  resilience: number;
  metadata: Record<string, ArchitectureValue>;
}

export interface ArchitectureSnapshot {
  id: string;
  systemKey: string;
  version: string;
  nodes: ArchitectureNode[];
  metadata: Record<string, ArchitectureValue>;
  createdAt: string;
}

export interface ArchitectureMutation {
  id: string;
  key: string;
  type: ArchitectureMutationType;
  target: string;
  description: string;
  expectedBenefit: number;
  expectedRisk: number;
  complexityDelta: number;
  maintainabilityDelta: number;
  resilienceDelta: number;
  reversible: boolean;
  dependencies: string[];
  metadata: Record<string, ArchitectureValue>;
}

export interface ArchitectureMutationPlan {
  systemKey: string;
  mutations: ArchitectureMutation[];
  rollbackMutations: ArchitectureMutation[];
  projectedComplexity: number;
  projectedMaintainability: number;
  projectedResilience: number;
  generatedAt: string;
}

export interface ArchitectureCompatibilityFinding {
  code: string;
  severity: ArchitectureSeverity;
  message: string;
  subject?: string;
  metadata: Record<string, ArchitectureValue>;
}

export interface ArchitectureCompatibilityReport {
  compatible: boolean;
  score: number;
  findings: ArchitectureCompatibilityFinding[];
  evaluatedAt: string;
}

export interface ArchitectureEvolutionSimulation {
  baseline: ArchitectureSnapshot;
  candidate: ArchitectureSnapshot;
  plan: ArchitectureMutationPlan;
  compatibility: ArchitectureCompatibilityReport;
  projectedScore: number;
  confidence: number;
  risks: string[];
  benefits: string[];
  simulatedAt: string;
}

export interface ArchitectureConflict {
  key: string;
  type: string;
  subjects: string[];
  severity: ArchitectureSeverity;
  message: string;
  metadata: Record<string, ArchitectureValue>;
}

export interface ArchitectureConflictResolution {
  conflictKey: string;
  resolved: boolean;
  strategy: string;
  mutations: ArchitectureMutation[];
  controls: string[];
}

export interface ArchitectureRefactoringRecommendation {
  key: string;
  target: string;
  priority: number;
  description: string;
  expectedBenefit: number;
  expectedRisk: number;
  mutations: ArchitectureMutation[];
}

export interface ArchitectureHealingAction {
  id: string;
  key: string;
  target: string;
  description: string;
  automated: boolean;
  order: number;
  dependencies: string[];
  controls: string[];
}

export interface ArchitectureHealingPlan {
  systemKey: string;
  actions: ArchitectureHealingAction[];
  automationCoverage: number;
  generatedAt: string;
}

export interface ArchitectureEvolutionDecisionResult {
  decision: ArchitectureEvolutionDecision;
  approved: boolean;
  score: number;
  confidence: number;
  reasons: string[];
  controls: string[];
  decidedAt: string;
}

export interface ArchitectureEvolutionKnowledgeRecord {
  id: string;
  systemKey: string;
  topic: string;
  summary: string;
  facts: Record<string, ArchitectureValue>;
  createdAt: string;
}

export interface ArchitectureEvolutionResult {
  success: boolean;
  mutationPlan: ArchitectureMutationPlan;
  simulation: ArchitectureEvolutionSimulation;
  conflicts: ArchitectureConflict[];
  resolutions: ArchitectureConflictResolution[];
  refactoring: ArchitectureRefactoringRecommendation[];
  healing: ArchitectureHealingPlan;
  decision: ArchitectureEvolutionDecisionResult;
  knowledge: ArchitectureEvolutionKnowledgeRecord[];
  completedAt: string;
}

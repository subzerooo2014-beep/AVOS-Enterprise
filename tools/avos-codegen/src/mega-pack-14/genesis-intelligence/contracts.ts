export type GenesisIntelligencePrimitive =
  | string
  | number
  | boolean
  | null;

export type GenesisIntelligenceValue =
  | GenesisIntelligencePrimitive
  | GenesisIntelligenceValue[]
  | {
      [key: string]: GenesisIntelligenceValue;
    };

export enum GenesisIntelligenceSeverity {
  INFO = "info",
  WARNING = "warning",
  ERROR = "error",
  CRITICAL = "critical",
}

export enum GenesisRecommendationType {
  KEEP = "keep",
  ADD = "add",
  REMOVE = "remove",
  REPLACE = "replace",
  UPGRADE = "upgrade",
  ISOLATE = "isolate",
  DEFER = "defer",
}

export enum GenesisDecisionOutcome {
  APPROVE = "approve",
  APPROVE_WITH_CONTROLS = "approve_with_controls",
  REQUIRE_REVIEW = "require_review",
  REJECT = "reject",
}

export interface GenesisBlueprintCandidate {
  key: string;
  version: string;
  capabilities: string[];
  dependencies: string[];
  conflicts: string[];
  qualityScore: number;
  securityScore: number;
  compatibilityScore: number;
  maintenanceScore: number;
  costScore: number;
  metadata: Record<string, GenesisIntelligenceValue>;
}

export interface GenesisBlueprintRequirement {
  capability: string;
  required: boolean;
  priority: number;
  preferredProviders: string[];
  excludedProviders: string[];
}

export interface GenesisOptimizationContext {
  systemKey: string;
  requirements: GenesisBlueprintRequirement[];
  candidates: GenesisBlueprintCandidate[];
  currentBlueprints: GenesisBlueprintCandidate[];
  constraints: Record<string, GenesisIntelligenceValue>;
}

export interface GenesisBlueprintScore {
  blueprintKey: string;
  version: string;
  total: number;
  quality: number;
  security: number;
  compatibility: number;
  maintenance: number;
  cost: number;
  capabilityCoverage: number;
  penalties: number;
  reasons: string[];
}

export interface GenesisBlueprintRecommendation {
  type: GenesisRecommendationType;
  blueprintKey: string;
  currentVersion?: string;
  targetVersion?: string;
  score: number;
  reasons: string[];
  controls: string[];
}

export interface GenesisOptimizationResult {
  systemKey: string;
  successful: boolean;
  scores: GenesisBlueprintScore[];
  recommendations: GenesisBlueprintRecommendation[];
  selectedBlueprints: GenesisBlueprintCandidate[];
  unresolvedCapabilities: string[];
  generatedAt: string;
}

export interface GenesisDependencyNode {
  key: string;
  kind: string;
  dependencies: string[];
  metadata: Record<string, GenesisIntelligenceValue>;
}

export interface GenesisDependencyEdge {
  from: string;
  to: string;
  type: string;
}

export interface GenesisDependencyFinding {
  code: string;
  severity: GenesisIntelligenceSeverity;
  message: string;
  subjects: string[];
  metadata: Record<string, GenesisIntelligenceValue>;
}

export interface GenesisDependencyAnalysis {
  nodes: GenesisDependencyNode[];
  edges: GenesisDependencyEdge[];
  cycles: string[][];
  missingDependencies: string[];
  findings: GenesisDependencyFinding[];
  analyzedAt: string;
}

export interface GenesisPlanningObjective {
  key: string;
  description: string;
  weight: number;
  target: number;
}

export interface GenesisPlanningConstraint {
  key: string;
  description: string;
  mandatory: boolean;
  expression: string;
  metadata: Record<string, GenesisIntelligenceValue>;
}

export interface GenesisPlanningInput {
  systemKey: string;
  objectives: GenesisPlanningObjective[];
  constraints: GenesisPlanningConstraint[];
  optimization: GenesisOptimizationResult;
  dependencyAnalysis: GenesisDependencyAnalysis;
  metadata: Record<string, GenesisIntelligenceValue>;
}

export interface GenesisPlanAction {
  id: string;
  key: string;
  name: string;
  description: string;
  order: number;
  dependencies: string[];
  mandatory: boolean;
  estimatedEffort: number;
  riskScore: number;
  inputs: Record<string, GenesisIntelligenceValue>;
  expectedOutputs: string[];
}

export interface GenesisIntelligentPlan {
  systemKey: string;
  actions: GenesisPlanAction[];
  rollbackActions: GenesisPlanAction[];
  score: number;
  risks: string[];
  generatedAt: string;
}

export interface GenesisKnowledgeRecord {
  id: string;
  namespace: string;
  topic: string;
  summary: string;
  facts: Record<string, GenesisIntelligenceValue>;
  source: string;
  createdAt: string;
  updatedAt: string;
}

export interface GenesisKnowledgeSyncResult {
  inserted: number;
  updated: number;
  skipped: number;
  conflicts: number;
  records: GenesisKnowledgeRecord[];
  synchronizedAt: string;
}

export interface GenesisValidationRule {
  key: string;
  name: string;
  description: string;
  severity: GenesisIntelligenceSeverity;
  enabled: boolean;
  priority: number;
  validate(
    context: GenesisValidationContext,
  ): GenesisValidationResult;
}

export interface GenesisValidationContext {
  optimization: GenesisOptimizationResult;
  dependencyAnalysis: GenesisDependencyAnalysis;
  plan: GenesisIntelligentPlan;
  metadata: Record<string, GenesisIntelligenceValue>;
}

export interface GenesisValidationIssue {
  code: string;
  severity: GenesisIntelligenceSeverity;
  message: string;
  subject?: string;
  metadata: Record<string, GenesisIntelligenceValue>;
}

export interface GenesisValidationResult {
  ruleKey: string;
  passed: boolean;
  issues: GenesisValidationIssue[];
}

export interface GenesisValidationReport {
  passed: boolean;
  score: number;
  results: GenesisValidationResult[];
  issues: GenesisValidationIssue[];
  validatedAt: string;
}

export interface GenesisDecisionResult {
  outcome: GenesisDecisionOutcome;
  approved: boolean;
  score: number;
  reasons: string[];
  controls: string[];
  decidedAt: string;
}

export interface GenesisIntelligenceResult {
  success: boolean;
  optimization: GenesisOptimizationResult;
  dependencyAnalysis: GenesisDependencyAnalysis;
  plan: GenesisIntelligentPlan;
  validation: GenesisValidationReport;
  decision: GenesisDecisionResult;
  knowledge: GenesisKnowledgeSyncResult;
  completedAt: string;
}

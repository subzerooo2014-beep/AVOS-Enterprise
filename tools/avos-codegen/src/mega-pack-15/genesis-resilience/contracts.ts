export type ResiliencePrimitive =
  | string
  | number
  | boolean
  | null;

export type ResilienceValue =
  | ResiliencePrimitive
  | ResilienceValue[]
  | {
      [key: string]: ResilienceValue;
    };

export enum ResilienceSeverity {
  INFO = "info",
  WARNING = "warning",
  ERROR = "error",
  CRITICAL = "critical",
}

export enum ResilienceScenarioType {
  DEPENDENCY_FAILURE = "dependency_failure",
  CAPACITY_PRESSURE = "capacity_pressure",
  BLUEPRINT_INCOMPATIBILITY = "blueprint_incompatibility",
  DATA_CORRUPTION = "data_corruption",
  CONFIGURATION_DRIFT = "configuration_drift",
  SECURITY_INCIDENT = "security_incident",
  NETWORK_PARTITION = "network_partition",
  SERVICE_DEGRADATION = "service_degradation",
}

export enum ResilienceDecision {
  ACCEPT = "accept",
  ACCEPT_WITH_CONTROLS = "accept_with_controls",
  REQUIRE_REDESIGN = "require_redesign",
  REJECT = "reject",
}

export interface ResilienceComponent {
  key: string;
  name: string;
  kind: string;
  criticality: number;
  dependencies: string[];
  recoveryTimeObjectiveMinutes: number;
  recoveryPointObjectiveMinutes: number;
  redundancyLevel: number;
  metadata: Record<string, ResilienceValue>;
}

export interface ResilienceScenario {
  id: string;
  key: string;
  name: string;
  description: string;
  type: ResilienceScenarioType;
  severity: ResilienceSeverity;
  targetComponents: string[];
  probability: number;
  durationMinutes: number;
  parameters: Record<string, ResilienceValue>;
}

export interface ResilienceSimulationInput {
  systemKey: string;
  components: ResilienceComponent[];
  scenarios: ResilienceScenario[];
  baselineScore: number;
  constraints: Record<string, ResilienceValue>;
}

export interface ResilienceImpact {
  scenarioKey: string;
  affectedComponents: string[];
  unavailableComponents: string[];
  degradedComponents: string[];
  estimatedDowntimeMinutes: number;
  estimatedDataLossMinutes: number;
  blastRadius: number;
  findings: ResilienceFinding[];
}

export interface ResilienceFinding {
  code: string;
  severity: ResilienceSeverity;
  message: string;
  subject?: string;
  metadata: Record<string, ResilienceValue>;
}

export interface ResilienceSimulationResult {
  systemKey: string;
  scenarioResults: ResilienceScenarioResult[];
  aggregateScore: number;
  weakestComponents: string[];
  criticalFindings: ResilienceFinding[];
  simulatedAt: string;
}

export interface ResilienceScenarioResult {
  scenario: ResilienceScenario;
  impact: ResilienceImpact;
  resilienceScore: number;
  recovered: boolean;
  recoveryActions: RecoveryAction[];
}

export interface RecoveryAction {
  id: string;
  key: string;
  name: string;
  description: string;
  order: number;
  dependencies: string[];
  targetComponent: string;
  estimatedDurationMinutes: number;
  automated: boolean;
  controls: string[];
}

export interface RecoveryStrategy {
  systemKey: string;
  actions: RecoveryAction[];
  estimatedRecoveryMinutes: number;
  estimatedDataLossMinutes: number;
  automationCoverage: number;
  generatedAt: string;
}

export interface EvolutionForecastInput {
  systemKey: string;
  currentScore: number;
  proposedChanges: EvolutionChange[];
  simulation: ResilienceSimulationResult;
}

export interface EvolutionChange {
  key: string;
  description: string;
  affectedComponents: string[];
  expectedBenefit: number;
  expectedRisk: number;
  complexity: number;
  reversibility: number;
  metadata: Record<string, ResilienceValue>;
}

export interface EvolutionImpactForecast {
  systemKey: string;
  projectedScore: number;
  confidence: number;
  risks: string[];
  benefits: string[];
  requiredControls: string[];
  forecastedAt: string;
}

export interface ResilienceDecisionResult {
  decision: ResilienceDecision;
  approved: boolean;
  score: number;
  confidence: number;
  reasons: string[];
  controls: string[];
  decidedAt: string;
}

export interface ResilienceEvidenceEntry {
  id: string;
  systemKey: string;
  category: string;
  action: string;
  message: string;
  metadata: Record<string, ResilienceValue>;
  createdAt: string;
}

export interface ResilienceKnowledgeRecord {
  id: string;
  systemKey: string;
  topic: string;
  summary: string;
  facts: Record<string, ResilienceValue>;
  createdAt: string;
}

export interface GenesisResilienceResult {
  success: boolean;
  simulation: ResilienceSimulationResult;
  recoveryStrategy: RecoveryStrategy;
  forecast: EvolutionImpactForecast;
  decision: ResilienceDecisionResult;
  evidence: ResilienceEvidenceEntry[];
  knowledge: ResilienceKnowledgeRecord[];
  completedAt: string;
}

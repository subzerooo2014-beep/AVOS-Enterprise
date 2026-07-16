export type DecisionStatus =
  | "DRAFT"
  | "EVALUATING"
  | "APPROVED"
  | "REJECTED"
  | "EXECUTED";

export interface DecisionRecord {
  id: string;
  title: string;
  objective: string;
  status: DecisionStatus;
  options: string[];
  selectedOption?: string;
  confidence?: number;
  rationale?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DecisionScenarioRecord {
  id: string;
  decisionId: string;
  name: string;
  assumptions: Record<string, unknown>;
  score: number;
  impact: number;
  risk: number;
  createdAt: string;
}

export interface RecommendationRecord {
  id: string;
  decisionId: string;
  option: string;
  score: number;
  reasons: string[];
  createdAt: string;
}

export interface KnowledgeEntityRecord {
  id: string;
  type: string;
  name: string;
  properties: Record<string, unknown>;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface KnowledgeRelationRecord {
  id: string;
  sourceId: string;
  targetId: string;
  relation: string;
  weight: number;
  createdAt: string;
}

export interface DigitalTwinRecord {
  id: string;
  name: string;
  twinType: string;
  sourceEntityId: string;
  state: Record<string, unknown>;
  health: "HEALTHY" | "DEGRADED" | "UNHEALTHY";
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface TwinSimulationRecord {
  id: string;
  twinId: string;
  scenario: string;
  inputs: Record<string, unknown>;
  outputs: Record<string, unknown>;
  score: number;
  simulatedAt: string;
}

export interface AutonomousOperationRecord {
  id: string;
  name: string;
  type: string;
  status: "PLANNED" | "RUNNING" | "COMPLETED" | "FAILED" | "BLOCKED";
  priority: number;
  context: Record<string, unknown>;
  steps: string[];
  currentStep?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  error?: string;
}

export interface CommandCenterAlertRecord {
  id: string;
  source: string;
  severity: "INFO" | "WARNING" | "HIGH" | "CRITICAL";
  title: string;
  message: string;
  status: "OPEN" | "ACKNOWLEDGED" | "RESOLVED";
  createdAt: string;
  resolvedAt?: string;
}

export interface IntelligenceCommandMetrics {
  decisions: number;
  approvedDecisions: number;
  scenarios: number;
  recommendations: number;
  knowledgeEntities: number;
  knowledgeRelations: number;
  digitalTwins: number;
  simulations: number;
  operations: number;
  runningOperations: number;
  failedOperations: number;
  alerts: number;
  openAlerts: number;
}

export interface IntelligenceCommandHealth {
  success: boolean;
  system: string;
  version: string;
  status: "READY" | "DEGRADED";
  metrics: IntelligenceCommandMetrics;
  components: Record<string, string>;
}

export type SloStatus =
  | "draft"
  | "active"
  | "breached"
  | "suspended"
  | "retired";

export type ErrorBudgetStatus =
  | "healthy"
  | "warning"
  | "exhausted";

export type CapacityRisk =
  | "low"
  | "medium"
  | "high"
  | "critical";

export type TrafficPolicyStatus =
  | "draft"
  | "active"
  | "triggered"
  | "disabled";

export type TrafficProtectionAction =
  | "none"
  | "monitor"
  | "throttle"
  | "shed_load"
  | "queue_requests"
  | "disable_noncritical_features"
  | "block_deployments"
  | "scale_out";

export interface ServiceLevelObjective {
  id: string;
  serviceName: string;
  environment: string;
  name: string;
  description: string;
  targetAvailabilityPercent: number;
  targetLatencyMs: number;
  maximumErrorRatePercent: number;
  measurementWindowMinutes: number;
  status: SloStatus;
  createdAt: string;
  updatedAt: string;
  activatedAt?: string;
}

export interface ServiceMetricSample {
  id: string;
  sloId: string;
  serviceName: string;
  availabilityPercent: number;
  latencyMs: number;
  errorRatePercent: number;
  requests: number;
  failures: number;
  cpuPercent: number;
  memoryPercent: number;
  queueDepth: number;
  recordedAt: string;
}

export interface ErrorBudget {
  id: string;
  sloId: string;
  serviceName: string;
  allowedErrorMinutes: number;
  consumedErrorMinutes: number;
  remainingErrorMinutes: number;
  consumedPercent: number;
  remainingPercent: number;
  status: ErrorBudgetStatus;
  calculatedAt: string;
}

export interface CapacityForecast {
  id: string;
  serviceName: string;
  environment: string;
  currentUtilizationPercent: number;
  projectedUtilizationPercent: number;
  forecastWindowMinutes: number;
  requestGrowthPercent: number;
  projectedRequests: number;
  risk: CapacityRisk;
  recommendedInstances: number;
  generatedAt: string;
}

export interface TrafficProtectionPolicy {
  id: string;
  serviceName: string;
  environment: string;
  name: string;
  status: TrafficPolicyStatus;
  triggerCpuPercent: number;
  triggerMemoryPercent: number;
  triggerLatencyMs: number;
  triggerErrorRatePercent: number;
  triggerQueueDepth: number;
  maximumRequestsPerMinute: number;
  action: TrafficProtectionAction;
  createdAt: string;
  updatedAt: string;
  triggeredAt?: string;
}

export interface TrafficProtectionExecution {
  id: string;
  policyId: string;
  serviceName: string;
  action: TrafficProtectionAction;
  reason: string;
  status: "completed" | "failed";
  beforeRequestsPerMinute: number;
  afterRequestsPerMinute: number;
  executedAt: string;
}

export interface SloEvaluation {
  id: string;
  sloId: string;
  serviceName: string;
  passed: boolean;
  availabilityPassed: boolean;
  latencyPassed: boolean;
  errorRatePassed: boolean;
  availabilityPercent: number;
  latencyMs: number;
  errorRatePercent: number;
  decision: TrafficProtectionAction;
  evaluatedAt: string;
}

export interface ReliabilityDecision {
  id: string;
  serviceName: string;
  sloId: string;
  decision: TrafficProtectionAction;
  reason: string;
  decidedBy: string;
  timestamp: string;
}

export interface ReliabilityEvidenceEntry {
  id: string;
  sequence: number;
  eventType: string;
  entityType: string;
  entityId: string;
  actor: string;
  timestamp: string;
  payload: Record<string, unknown>;
  previousHash: string;
  hash: string;
}

export interface ReliabilityPlatformEvent {
  id: string;
  eventType: string;
  entityType: string;
  entityId: string;
  timestamp: string;
  payload: Record<string, unknown>;
}

export interface ReliabilitySnapshot {
  generatedAt: string;
  healthStatus: "healthy" | "degraded" | "critical";
  evidenceChainVerified: boolean;
  serviceLevelObjectives: number;
  activeServiceLevelObjectives: number;
  breachedServiceLevelObjectives: number;
  metricSamples: number;
  sloEvaluations: number;
  passedEvaluations: number;
  failedEvaluations: number;
  errorBudgets: number;
  healthyErrorBudgets: number;
  exhaustedErrorBudgets: number;
  capacityForecasts: number;
  highRiskForecasts: number;
  criticalRiskForecasts: number;
  trafficPolicies: number;
  activeTrafficPolicies: number;
  triggeredTrafficPolicies: number;
  protectionExecutions: number;
  reliabilityDecisions: number;
  evidenceEntries: number;
  platformEvents: number;
}

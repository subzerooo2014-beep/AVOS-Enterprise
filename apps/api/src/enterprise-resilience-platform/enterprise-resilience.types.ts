export type CircuitState = "CLOSED" | "OPEN" | "HALF_OPEN";

export interface CircuitBreakerRecord {
  key: string;
  state: CircuitState;
  failures: number;
  successes: number;
  threshold: number;
  resetAfterMs: number;
  openedAt?: string;
  updatedAt: string;
}

export interface RetryPolicyRecord {
  id: string;
  maxAttempts: number;
  baseDelayMs: number;
  backoffMultiplier: number;
  enabled: boolean;
}

export interface TimeoutPolicyRecord {
  id: string;
  timeoutMs: number;
  enabled: boolean;
}

export interface RateLimitRecord {
  key: string;
  limit: number;
  windowMs: number;
  count: number;
  windowStartedAt: string;
}

export interface BulkheadRecord {
  key: string;
  maxConcurrency: number;
  active: number;
  queued: number;
}

export interface FailoverTargetRecord {
  id: string;
  group: string;
  priority: number;
  healthy: boolean;
  metadata: Record<string, unknown>;
}

export interface ChaosExperimentRecord {
  id: string;
  name: string;
  target: string;
  type: "LATENCY" | "ERROR" | "UNAVAILABLE";
  magnitude: number;
  enabled: boolean;
  createdAt: string;
}

export interface SloDefinitionRecord {
  id: string;
  service: string;
  availabilityTarget: number;
  latencyTargetMs: number;
  errorBudgetPercent: number;
  enabled: boolean;
}

export interface SliMeasurementRecord {
  id: string;
  sloId: string;
  availability: number;
  latencyMs: number;
  errorRate: number;
  compliant: boolean;
  measuredAt: string;
}

export interface ResilienceMetrics {
  circuitBreakers: number;
  openCircuits: number;
  retryPolicies: number;
  timeoutPolicies: number;
  rateLimits: number;
  bulkheads: number;
  failoverTargets: number;
  chaosExperiments: number;
  slos: number;
  sliMeasurements: number;
  sloViolations: number;
}

export interface ResilienceHealth {
  success: boolean;
  system: string;
  version: string;
  status: "READY" | "DEGRADED";
  metrics: ResilienceMetrics;
  components: Record<string, string>;
}

export interface PerformanceBenchmarkV1 {
  id: string;
  name: string;
  targetP95Ms: number;
  measuredP95Ms: number;
  targetThroughput: number;
  measuredThroughput: number;
  passed: boolean;
  createdAt: string;
}

export interface ChaosExperimentV1 {
  id: string;
  name: string;
  faultType: "LATENCY" | "SERVICE_FAILURE" | "NETWORK_PARTITION" | "RESOURCE_EXHAUSTION";
  target: string;
  status: "PLANNED" | "RUNNING" | "COMPLETED" | "FAILED";
  resilienceScore: number;
  findings: string[];
  createdAt: string;
  completedAt?: string;
}

export interface DisasterRecoveryPlanV1 {
  id: string;
  name: string;
  rtoMinutes: number;
  rpoMinutes: number;
  regions: string[];
  status: "DRAFT" | "VALIDATED" | "FAILED";
  lastTestedAt?: string;
  findings: string[];
}

export interface MultiNodeValidationV1 {
  id: string;
  nodes: string[];
  quorumRequired: number;
  healthyNodes: number;
  replicationHealthy: boolean;
  passed: boolean;
  checkedAt: string;
}

export interface SecurityReadinessCheckV1 {
  id: string;
  name: string;
  passed: boolean;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  details: string[];
  checkedAt: string;
}

export interface ReleaseReadinessGateV1 {
  id: string;
  name: string;
  required: boolean;
  passed: boolean;
  evidence: string[];
  checkedAt: string;
}

export interface ProductionCertificationV1 {
  id: string;
  version: string;
  score: number;
  status: "CERTIFIED" | "CONDITIONAL" | "REJECTED";
  passedGates: number;
  failedGates: number;
  issuedAt: string;
  notes: string[];
}

export interface HardeningMetricsV1 {
  benchmarks: number;
  passedBenchmarks: number;
  chaosExperiments: number;
  passedChaosExperiments: number;
  disasterRecoveryPlans: number;
  validatedRecoveryPlans: number;
  multiNodeValidations: number;
  passedMultiNodeValidations: number;
  securityChecks: number;
  failedSecurityChecks: number;
  readinessGates: number;
  passedReadinessGates: number;
  certifications: number;
}

export interface HardeningPlatformStatusV1 {
  success: boolean;
  system: string;
  version: string;
  status: "READY" | "DEGRADED";
  metrics: HardeningMetricsV1;
  components: Record<string, string>;
}

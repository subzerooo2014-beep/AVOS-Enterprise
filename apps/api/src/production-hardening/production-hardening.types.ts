export const PRODUCTION_HARDENING_CAPABILITIES = [
  'security-hardening-engine',
  'authentication-hardening-engine',
  'authorization-hardening-engine',
  'secret-exposure-audit-engine',
  'input-validation-hardening-engine',
  'performance-profiling-engine',
  'scalability-readiness-engine',
  'reliability-policy-engine',
  'resilience-pattern-engine',
  'disaster-recovery-engine',
  'backup-restore-validation-engine',
  'observability-readiness-engine',
  'incident-response-readiness-engine',
  'production-configuration-audit-engine',
  'production-readiness-score-engine',
  'production-hardening-orchestrator',
  'production-hardening-dashboard',
] as const;

export type ProductionHardeningCapability =
  (typeof PRODUCTION_HARDENING_CAPABILITIES)[number];

export interface SecurityControl {
  id: string;
  category: string;
  required: boolean;
  enabled: boolean;
  evidence: string[];
}

export interface PerformanceMetric {
  id: string;
  component: string;
  latencyMs: number;
  throughput: number;
  errorRate: number;
  cpuPercent: number;
  memoryMb: number;
  targetLatencyMs: number;
}

export interface ReliabilityPolicy {
  id: string;
  service: string;
  timeoutMs: number;
  retries: number;
  circuitBreakerEnabled: boolean;
  gracefulShutdownEnabled: boolean;
}

export interface RecoveryScenario {
  id: string;
  name: string;
  backupAvailable: boolean;
  restoreTested: boolean;
  rollbackTested: boolean;
  recoveryTimeMinutes: number;
  recoveryPointMinutes: number;
}

export interface ObservabilityControl {
  id: string;
  logs: boolean;
  metrics: boolean;
  traces: boolean;
  alerts: boolean;
  readiness: boolean;
  liveness: boolean;
}

export interface ProductionConfiguration {
  environment: string;
  httpsEnabled: boolean;
  corsRestricted: boolean;
  rateLimitingEnabled: boolean;
  secretsExternalized: boolean;
  databaseTlsEnabled: boolean;
  cacheEnabled: boolean;
  queueEnabled: boolean;
}

export interface ProductionHardeningDashboardSnapshot {
  generatedAt: string;
  securityScore: number;
  performanceScore: number;
  scalabilityScore: number;
  reliabilityScore: number;
  recoveryScore: number;
  observabilityScore: number;
  productionReadinessScore: number;
  capabilityStatus: Record<
    ProductionHardeningCapability,
    'operational'
  >;
}
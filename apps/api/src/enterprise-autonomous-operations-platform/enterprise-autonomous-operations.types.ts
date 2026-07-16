export interface OperationsSignalRecord {
  id: string;
  source: string;
  metric: string;
  value: number;
  threshold: number;
  severity: "INFO" | "WARNING" | "HIGH" | "CRITICAL";
  createdAt: string;
}

export interface OperationsActionRecord {
  id: string;
  name: string;
  actionType: string;
  target: string;
  status: "PLANNED" | "RUNNING" | "COMPLETED" | "FAILED" | "BLOCKED";
  parameters: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  error?: string;
}

export interface HealingPolicyRecord {
  id: string;
  signalMetric: string;
  operator: "GT" | "GTE" | "LT" | "LTE" | "EQ";
  threshold: number;
  actionType: string;
  target: string;
  enabled: boolean;
}

export interface CapacityForecastRecord {
  id: string;
  resource: string;
  currentUsage: number;
  projectedUsage: number;
  recommendedCapacity: number;
  horizonHours: number;
  createdAt: string;
}

export interface CostOptimizationRecord {
  id: string;
  resource: string;
  currentCost: number;
  projectedCost: number;
  savings: number;
  recommendation: string;
  createdAt: string;
}

export interface OperationsIncidentRecord {
  id: string;
  title: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  status: "OPEN" | "INVESTIGATING" | "RESOLVED";
  source: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface AutonomousOperationsMetrics {
  signals: number;
  criticalSignals: number;
  actions: number;
  runningActions: number;
  failedActions: number;
  healingPolicies: number;
  forecasts: number;
  optimizations: number;
  incidents: number;
  openIncidents: number;
}

export interface AutonomousOperationsHealth {
  success: boolean;
  system: string;
  version: string;
  status: "READY" | "DEGRADED";
  metrics: AutonomousOperationsMetrics;
  components: Record<string, string>;
}

export interface OperationsServiceStatusV1 {
  id: string;
  name: string;
  status: "HEALTHY" | "DEGRADED" | "UNHEALTHY" | "UNKNOWN";
  score: number;
  latencyMs: number;
  errorRate: number;
  details: string[];
  updatedAt: string;
}

export interface OperationsIncidentV1 {
  id: string;
  title: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  status: "OPEN" | "INVESTIGATING" | "MITIGATED" | "RESOLVED";
  affectedServices: string[];
  owner?: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface OperationsHealingActionV1 {
  id: string;
  incidentId: string;
  serviceId: string;
  action: "RESTART" | "FAILOVER" | "ISOLATE" | "ROLLBACK" | "SCALE_OUT";
  status: "PLANNED" | "EXECUTING" | "COMPLETED" | "FAILED";
  result?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OperationsTelemetryV1 {
  id: string;
  source: string;
  metric: string;
  value: number;
  labels: Record<string, string>;
  recordedAt: string;
}

export interface OperationsDiagnosticV1 {
  id: string;
  category: string;
  status: "PASS" | "WARN" | "FAIL";
  findings: string[];
  createdAt: string;
}

export interface OperationsDashboardV1 {
  generatedAt: string;
  overallStatus: "HEALTHY" | "DEGRADED" | "UNHEALTHY";
  healthScore: number;
  activeIncidents: number;
  criticalIncidents: number;
  completedHealingActions: number;
  telemetryPoints: number;
  failedDiagnostics: number;
  serviceStatuses: OperationsServiceStatusV1[];
}

export interface OperationsMetricsV1 {
  services: number;
  healthyServices: number;
  degradedServices: number;
  unhealthyServices: number;
  incidents: number;
  openIncidents: number;
  criticalIncidents: number;
  healingActions: number;
  completedHealingActions: number;
  telemetryPoints: number;
  diagnostics: number;
  failedDiagnostics: number;
}

export interface OperationsPlatformStatusV1 {
  success: boolean;
  system: string;
  version: string;
  status: "READY" | "DEGRADED";
  metrics: OperationsMetricsV1;
  components: Record<string, string>;
}

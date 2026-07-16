export type HealthState = "HEALTHY" | "DEGRADED" | "UNHEALTHY";
export type AlertSeverity = "INFO" | "WARNING" | "HIGH" | "CRITICAL";
export type IncidentStatus = "OPEN" | "INVESTIGATING" | "RESOLVED";

export interface ServiceHealthRecord {
  id: string;
  service: string;
  state: HealthState;
  latencyMs: number;
  errorRate: number;
  metadata: Record<string, unknown>;
  checkedAt: string;
}

export interface MetricRecord {
  id: string;
  name: string;
  value: number;
  unit: string;
  labels: Record<string, string>;
  recordedAt: string;
}

export interface StructuredLogRecord {
  id: string;
  level: "DEBUG" | "INFO" | "WARN" | "ERROR";
  message: string;
  service: string;
  correlationId?: string;
  traceId?: string;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export interface TraceSpanRecord {
  id: string;
  traceId: string;
  parentSpanId?: string;
  service: string;
  operation: string;
  startedAt: string;
  completedAt?: string;
  durationMs?: number;
  status: "STARTED" | "COMPLETED" | "FAILED";
  metadata: Record<string, unknown>;
}

export interface AlertRuleRecord {
  id: string;
  name: string;
  metric: string;
  operator: "GT" | "GTE" | "LT" | "LTE" | "EQ";
  threshold: number;
  severity: AlertSeverity;
  enabled: boolean;
}

export interface AlertRecord {
  id: string;
  ruleId: string;
  metric: string;
  value: number;
  severity: AlertSeverity;
  status: "OPEN" | "ACKNOWLEDGED" | "RESOLVED";
  createdAt: string;
  resolvedAt?: string;
}

export interface IncidentRecord {
  id: string;
  title: string;
  description: string;
  severity: AlertSeverity;
  status: IncidentStatus;
  service?: string;
  timeline: IncidentTimelineEntry[];
  createdAt: string;
  resolvedAt?: string;
}

export interface IncidentTimelineEntry {
  id: string;
  message: string;
  createdAt: string;
}

export interface ReliabilityObservabilityMetrics {
  services: number;
  healthyServices: number;
  degradedServices: number;
  unhealthyServices: number;
  metrics: number;
  logs: number;
  traces: number;
  openAlerts: number;
  incidents: number;
  openIncidents: number;
}

export interface ReliabilityObservabilityHealth {
  success: boolean;
  system: string;
  version: string;
  status: "READY" | "DEGRADED";
  metrics: ReliabilityObservabilityMetrics;
  components: Record<string, string>;
}

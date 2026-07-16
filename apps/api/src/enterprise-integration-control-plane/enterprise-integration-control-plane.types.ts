export type IntegrationComponentType =
  | "HUB"
  | "PROVIDER"
  | "CONNECTOR"
  | "WEBHOOK"
  | "GATEWAY"
  | "SECURITY"
  | "RELIABILITY"
  | "MONITORING"
  | "SCHEDULER"
  | "TRANSFORMATION"
  | "UNKNOWN";

export interface IntegrationComponentRecord {
  id: string;
  name: string;
  type: IntegrationComponentType;
  filePath: string;
  domain: string;
  version: string;
  capabilities: string[];
  dependencies: string[];
  status: "DISCOVERED" | "ACTIVE";
  discoveredAt: string;
}

export interface IntegrationRouteRecord {
  id: string;
  source: string;
  target: string;
  operation: string;
  version: string;
  enabled: boolean;
  priority: number;
}

export interface IntegrationProviderRecord {
  id: string;
  name: string;
  domain: string;
  version: string;
  capabilities: string[];
  health: "HEALTHY" | "DEGRADED" | "UNKNOWN";
}

export interface IntegrationExecutionRecord {
  id: string;
  routeId: string;
  providerId?: string;
  status: "STARTED" | "COMPLETED" | "FAILED";
  attempts: number;
  startedAt: string;
  completedAt?: string;
  durationMs?: number;
  error?: string;
}

export interface IntegrationControlPlaneMetrics {
  components: number;
  providers: number;
  routes: number;
  executions: number;
  completed: number;
  failed: number;
  healthyProviders: number;
  degradedProviders: number;
}

export interface IntegrationControlPlaneHealth {
  success: boolean;
  system: string;
  version: string;
  status: "READY" | "DEGRADED";
  metrics: IntegrationControlPlaneMetrics;
  components: Record<string, string>;
}

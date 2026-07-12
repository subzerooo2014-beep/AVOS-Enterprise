export type V5Primitive = string | number | boolean | null;
export type V5Value =
  | V5Primitive
  | V5Value[]
  | { [key: string]: V5Value };

export enum V5DistributedStatus {
  READY = "ready",
  DEGRADED = "degraded",
  BLOCKED = "blocked",
}

export interface V5ServiceDomain {
  key: string;
  entityName: string;
  capabilities: string[];
  dependencies?: string[];
  criticality?: "low" | "medium" | "high";
}

export interface V5DistributedRuntimeInput {
  systemKey: string;
  systemName: string;
  domains: V5ServiceDomain[];
  broker: "kafka" | "rabbitmq" | "nats";
  enableSaga?: boolean;
  enableServiceDiscovery?: boolean;
  enableOpenTelemetry?: boolean;
  enableSecretsPlan?: boolean;
}

export interface V5MicroserviceDefinition {
  key: string;
  serviceName: string;
  domainKey: string;
  port: number;
  capabilities: string[];
  dependencies: string[];
  healthEndpoint: string;
  readinessEndpoint: string;
}

export interface V5GatewayRoute {
  path: string;
  targetService: string;
  methods: string[];
  timeoutMs: number;
  retries: number;
}

export interface V5EventContract {
  key: string;
  producer: string;
  consumers: string[];
  version: string;
  payload: Record<string, string>;
}

export interface V5SagaDefinition {
  key: string;
  trigger: string;
  steps: Array<{
    service: string;
    action: string;
    compensation: string;
  }>;
}

export interface V5ServiceContract {
  service: string;
  operations: Array<{
    name: string;
    input: Record<string, string>;
    output: Record<string, string>;
  }>;
}

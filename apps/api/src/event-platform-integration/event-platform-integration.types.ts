export type EventPlatformComponentType =
  | "EVENT_BUS"
  | "EVENT_REGISTRY"
  | "EVENT_DISPATCHER"
  | "RETRY_POLICY"
  | "DEAD_LETTER"
  | "EVENT_MODULE"
  | "INFRASTRUCTURE_EVENT_BUS"
  | "DOMAIN_EVENTS"
  | "UNKNOWN";

export interface EventPlatformComponent {
  id: string;
  name: string;
  type: EventPlatformComponentType;
  filePath: string;
  domain: string;
  version: string;
  capabilities: string[];
  dependencies: string[];
  status: "ACTIVE" | "DISCOVERED";
  discoveredAt: string;
}

export interface EventPlatformRoute {
  source: string;
  target: string;
  eventType: string;
  mode: "DIRECT" | "BRIDGED";
}

export interface EventPlatformMetrics {
  totalComponents: number;
  eventBuses: number;
  registries: number;
  dispatchers: number;
  retryPolicies: number;
  deadLetterServices: number;
  domainEventFolders: number;
  routes: number;
}

export interface EventPlatformHealth {
  success: boolean;
  system: string;
  version: string;
  status: "READY" | "DEGRADED";
  metrics: EventPlatformMetrics;
  components: Record<string, string>;
}

export type UrpAdapterOperation =
  | "health"
  | "readiness"
  | "boot"
  | "command"
  | "query"
  | "event";

export interface UrpEndpointCandidate {
  operation: UrpAdapterOperation;
  method: "GET" | "POST";
  path: string;
  priority: number;
}

export interface UrpRuntimeAdapterDefinition {
  key: string;
  name: string;
  version: string;
  endpointCandidates: UrpEndpointCandidate[];
  eventTopics: string[];
  metadata: Record<string, unknown>;
}

export interface UrpDiscoveredEndpoint {
  unitKey: string;
  operation: UrpAdapterOperation;
  method: "GET" | "POST";
  path: string;
  url: string;
  status: "available" | "unavailable" | "unknown";
  statusCode?: number;
  latencyMs?: number;
  discoveredAt: string;
  error?: string;
}

export interface UrpCircuitState {
  key: string;
  state: "closed" | "open" | "half-open";
  failures: number;
  successes: number;
  openedAt?: string;
  nextProbeAt?: string;
  updatedAt: string;
}

export interface UrpDispatchRequest {
  unitKey: string;
  operation: "command" | "query";
  name: string;
  payload?: unknown;
  requestedBy: string;
  correlationId?: string;
  timeoutMs?: number;
  retries?: number;
}

export interface UrpBridgeEvent {
  id: string;
  topic: string;
  type: string;
  source: string;
  target?: string;
  payload: unknown;
  correlationId: string;
  occurredAt: string;
}
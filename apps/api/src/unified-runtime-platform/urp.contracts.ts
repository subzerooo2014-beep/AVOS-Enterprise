export type UrpRuntimeStatus =
  | "registered"
  | "starting"
  | "operational"
  | "degraded"
  | "stopping"
  | "stopped"
  | "failed";

export type UrpRuntimeKind =
  | "foundation"
  | "fabric"
  | "kernel"
  | "brain"
  | "execution"
  | "studio"
  | "platform"
  | "product"
  | "service";

export interface UrpRuntimeUnit {
  key: string;
  name: string;
  version: string;
  kind: UrpRuntimeKind;
  status: UrpRuntimeStatus;
  dependencies: string[];
  capabilities: string[];
  healthEndpoint?: string;
  metadata: Record<string, unknown>;
  registeredAt: string;
  updatedAt: string;
}

export interface UrpCommand<T = unknown> {
  id: string;
  name: string;
  target: string;
  payload: T;
  requestedBy: string;
  correlationId: string;
  createdAt: string;
}

export interface UrpQuery<T = unknown> {
  id: string;
  name: string;
  target: string;
  payload: T;
  requestedBy: string;
  correlationId: string;
  createdAt: string;
}

export interface UrpEvent<T = unknown> {
  id: string;
  topic: string;
  type: string;
  source: string;
  payload: T;
  correlationId: string;
  occurredAt: string;
}

export interface UrpRoute {
  key: string;
  type: "command" | "query" | "event" | "workflow";
  target: string;
  priority: number;
  enabled: boolean;
}

export interface UrpResourceSnapshot {
  timestamp: string;
  process: {
    pid: number;
    uptimeSeconds: number;
    memoryRssBytes: number;
    heapUsedBytes: number;
    heapTotalBytes: number;
  };
  runtime: {
    registeredUnits: number;
    operationalUnits: number;
    degradedUnits: number;
    failedUnits: number;
  };
}
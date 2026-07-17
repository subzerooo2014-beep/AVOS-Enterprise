export type MeshRouteKind =
  | "capability"
  | "decision"
  | "knowledge"
  | "orchestration"
  | "event"
  | "kernel"
  | "memory"
  | "ai";

export type MeshOperationStatus =
  | "accepted"
  | "routing"
  | "completed"
  | "failed"
  | "rejected";

export type MeshNodeStatus = "online" | "degraded" | "offline";

export interface MeshIdentity {
  readonly tenantId?: string;
  readonly actorId: string;
  readonly actorType: "human" | "agent" | "service" | "system";
  readonly roles: readonly string[];
}

export interface MeshContext {
  readonly correlationId: string;
  readonly causationId?: string;
  readonly traceId: string;
  readonly source: string;
  readonly priority: "low" | "normal" | "high" | "critical";
  readonly identity: MeshIdentity;
  readonly metadata: Readonly<Record<string, unknown>>;
}

export interface MeshRequest {
  readonly id: string;
  readonly route: MeshRouteKind;
  readonly action: string;
  readonly payload: Readonly<Record<string, unknown>>;
  readonly context: MeshContext;
  readonly createdAt: string;
}

export interface MeshTrace {
  readonly id: string;
  readonly requestId: string;
  readonly step: string;
  readonly node?: string;
  readonly message: string;
  readonly data?: Readonly<Record<string, unknown>>;
  readonly createdAt: string;
}

export interface MeshResult {
  readonly requestId: string;
  readonly route: MeshRouteKind;
  readonly action: string;
  readonly status: MeshOperationStatus;
  readonly output: Readonly<Record<string, unknown>>;
  readonly explanation: readonly string[];
  readonly traces: readonly MeshTrace[];
  readonly startedAt: string;
  readonly completedAt: string;
  readonly durationMs: number;
}

export interface MeshNode {
  readonly id: string;
  readonly name: string;
  readonly kind: MeshRouteKind;
  readonly status: MeshNodeStatus;
  readonly version: string;
  readonly actions: readonly string[];
  readonly dependencies: readonly string[];
  readonly metadata: Readonly<Record<string, unknown>>;
  readonly registeredAt: string;
  readonly lastSeenAt: string;
}

export interface MeshEvent {
  readonly id: string;
  readonly topic: string;
  readonly type: string;
  readonly source: string;
  readonly payload: Readonly<Record<string, unknown>>;
  readonly context: MeshContext;
  readonly createdAt: string;
}

export interface MeshHealth {
  readonly system: "AVOS Enterprise Intelligence Mesh";
  readonly status: "healthy" | "degraded" | "critical";
  readonly score: number;
  readonly nodeCount: number;
  readonly onlineNodes: number;
  readonly degradedNodes: number;
  readonly offlineNodes: number;
  readonly requestCount: number;
  readonly completedCount: number;
  readonly failedCount: number;
  readonly successRate: number;
  readonly generatedAt: string;
}
export type KnowledgeFabricRuntimeStatus =
  | "stopped"
  | "starting"
  | "running"
  | "degraded"
  | "stopping"
  | "failed";

export type KnowledgeOperation =
  | "search"
  | "retrieve"
  | "ingest"
  | "govern"
  | "graph"
  | "health";

export interface KnowledgeFabricRuntimeSnapshot {
  readonly status: KnowledgeFabricRuntimeStatus;
  readonly startedAt?: string;
  readonly stoppedAt?: string;
  readonly lastTransitionAt: string;
  readonly activeRequests: number;
  readonly completedRequests: number;
  readonly failedRequests: number;
  readonly version: string;
}

export interface KnowledgeFabricQuery {
  readonly query: string;
  readonly tenantId?: string;
  readonly actorId?: string;
  readonly limit?: number;
  readonly filters?: Readonly<Record<string, unknown>>;
  readonly correlationId?: string;
}

export interface KnowledgeEvidence {
  readonly sourceId: string;
  readonly sourceType: string;
  readonly title?: string;
  readonly excerpt?: string;
  readonly score: number;
  readonly trustScore: number;
  readonly metadata?: Readonly<Record<string, unknown>>;
}

export interface KnowledgeSearchResult {
  readonly correlationId: string;
  readonly query: string;
  readonly normalizedQuery: string;
  readonly intent: string;
  readonly evidence: readonly KnowledgeEvidence[];
  readonly total: number;
  readonly durationMs: number;
  readonly generatedAt: string;
}

export interface KnowledgeRegistryEntry {
  readonly id: string;
  readonly type: string;
  readonly name: string;
  readonly version: string;
  readonly enabled: boolean;
  readonly health: "healthy" | "degraded" | "unavailable";
  readonly metadata?: Readonly<Record<string, unknown>>;
  readonly registeredAt: string;
  readonly updatedAt: string;
}

export interface KnowledgeFabricMetricSnapshot {
  readonly timestamp: string;
  readonly uptimeMs: number;
  readonly activeRequests: number;
  readonly completedRequests: number;
  readonly failedRequests: number;
  readonly successRate: number;
  readonly averageLatencyMs: number;
  readonly p95LatencyMs: number;
  readonly registryEntries: number;
  readonly emittedEvents: number;
}

export interface KnowledgeFabricVerificationResult {
  readonly id: string;
  readonly status: "passed" | "failed";
  readonly score: number;
  readonly checks: Readonly<Record<string, boolean>>;
  readonly findings: readonly string[];
  readonly verifiedAt: string;
}

export interface KnowledgeFabricCertification {
  readonly id: string;
  readonly verificationId: string;
  readonly status: "certified" | "rejected";
  readonly score: number;
  readonly level: "excellent" | "good" | "needs-improvement";
  readonly blockingFindings: readonly string[];
  readonly certifiedAt: string;
}
export type KnowledgeRuntimeSessionStatus = "ACTIVE" | "COMPLETED" | "FAILED" | "EXPIRED";
export type KnowledgeRuntimeOperation = "QUERY" | "RESOLVE" | "RETRIEVE" | "ASSEMBLE_CONTEXT";

export interface KnowledgeRuntimePrincipal {
  id: string;
  type: "USER" | "AGENT" | "SERVICE" | "SYSTEM";
  roles: string[];
  permissions: string[];
}

export interface KnowledgeRuntimeRequest {
  operation: KnowledgeRuntimeOperation;
  query: string;
  namespace?: string;
  knowledgeIds?: string[];
  tags?: string[];
  limit?: number;
  minimumTrustScore?: number;
  includeDeprecated?: boolean;
  principal: KnowledgeRuntimePrincipal;
  correlationId?: string;
  metadata?: Record<string, unknown>;
}

export interface KnowledgeRuntimeContextItem {
  knowledgeId: string;
  key: string;
  name: string;
  namespace: string;
  version: number;
  content: unknown;
  tags: string[];
  trustScore: number;
  confidenceScore: number;
  relevanceScore: number;
  source: "REGISTRY" | "CACHE" | "DEPENDENCY";
}

export interface KnowledgeRuntimeContext {
  id: string;
  sessionId: string;
  query: string;
  items: KnowledgeRuntimeContextItem[];
  tokenEstimate: number;
  checksum: string;
  assembledAt: string;
}

export interface KnowledgeRuntimeSession {
  id: string;
  correlationId: string;
  status: KnowledgeRuntimeSessionStatus;
  principal: KnowledgeRuntimePrincipal;
  request: KnowledgeRuntimeRequest;
  context?: KnowledgeRuntimeContext;
  startedAt: string;
  completedAt?: string;
  expiresAt: string;
  error?: string;
}

export interface KnowledgeRuntimeResult {
  success: boolean;
  sessionId: string;
  correlationId: string;
  operation: KnowledgeRuntimeOperation;
  context: KnowledgeRuntimeContext;
  diagnostics: KnowledgeRuntimeDiagnostics;
}

export interface KnowledgeRuntimeDiagnostics {
  durationMs: number;
  candidates: number;
  resolved: number;
  cacheHits: number;
  cacheMisses: number;
  policyDenied: number;
  dependencyExpansions: number;
  warnings: string[];
}

export interface KnowledgeRuntimeMetrics {
  sessionsStarted: number;
  sessionsCompleted: number;
  sessionsFailed: number;
  activeSessions: number;
  queriesExecuted: number;
  cacheHits: number;
  cacheMisses: number;
  policyDenials: number;
  averageDurationMs: number;
  lastExecutionAt?: string;
}

export interface KnowledgeRuntimeEvent {
  id: string;
  type: string;
  sessionId?: string;
  correlationId?: string;
  occurredAt: string;
  payload: Record<string, unknown>;
}

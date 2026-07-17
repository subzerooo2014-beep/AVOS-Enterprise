import { KnowledgeRuntimeRequest } from "./knowledge-runtime.types";

export interface CreateKnowledgeRuntimeSessionInput {
  request: KnowledgeRuntimeRequest;
  ttlSeconds?: number;
}

export interface ExecuteKnowledgeRuntimeInput extends KnowledgeRuntimeRequest {}

export interface KnowledgeRuntimeQueryInput {
  query: string;
  namespace?: string;
  tags?: string[];
  limit?: number;
  minimumTrustScore?: number;
  principalId?: string;
  principalType?: "USER" | "AGENT" | "SERVICE" | "SYSTEM";
  roles?: string[];
  permissions?: string[];
  correlationId?: string;
}

export interface InvalidateKnowledgeRuntimeCacheInput {
  knowledgeId?: string;
  namespace?: string;
  all?: boolean;
}

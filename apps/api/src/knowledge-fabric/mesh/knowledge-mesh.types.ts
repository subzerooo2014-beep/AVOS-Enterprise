export type KnowledgeMeshNodeState = "ACTIVE" | "DEGRADED" | "DRAINING" | "OFFLINE";
export type KnowledgeMeshDomainState = "ACTIVE" | "READ_ONLY" | "SUSPENDED";
export type KnowledgeMeshConsistency = "EVENTUAL" | "SESSION" | "STRONG";
export type KnowledgeMeshRouteStrategy = "LOCALITY" | "PRIORITY" | "ROUND_ROBIN" | "BROADCAST";

export interface KnowledgeMeshNode {
  id: string;
  name: string;
  domainId: string;
  endpoint: string;
  state: KnowledgeMeshNodeState;
  capabilities: string[];
  weight: number;
  registeredAt: string;
  updatedAt: string;
}

export interface KnowledgeMeshDomain {
  id: string;
  name: string;
  namespace: string;
  owner: string;
  state: KnowledgeMeshDomainState;
  consistency: KnowledgeMeshConsistency;
  createdAt: string;
  updatedAt: string;
}

export interface KnowledgeMeshRoute {
  id: string;
  namespace: string;
  domainId: string;
  nodeId?: string;
  priority: number;
  strategy: KnowledgeMeshRouteStrategy;
  enabled: boolean;
  createdAt: string;
}

export interface KnowledgeMeshSharePolicy {
  id: string;
  sourceDomainId: string;
  targetDomainId: string;
  namespaces: string[];
  operations: Array<"READ" | "WRITE" | "SYNC">;
  enabled: boolean;
  createdAt: string;
}

export interface KnowledgeMeshRequest {
  id: string;
  namespace: string;
  operation: "READ" | "WRITE" | "SYNC";
  sourceDomainId: string;
  targetDomainId?: string;
  payload: Record<string, unknown>;
  requestedAt: string;
}

export interface KnowledgeMeshResponse {
  requestId: string;
  routeId?: string;
  nodeId?: string;
  accepted: boolean;
  reason: string;
  consistency: KnowledgeMeshConsistency;
  completedAt: string;
}
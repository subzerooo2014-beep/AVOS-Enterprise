export type FederationNodeState = "ACTIVE" | "DEGRADED" | "SUSPENDED" | "OFFLINE";
export type FederationTrustLevel = "UNTRUSTED" | "RESTRICTED" | "TRUSTED" | "SOVEREIGN";
export type FederationQueryMode = "LOCAL_FIRST" | "REMOTE_FIRST" | "BROADCAST" | "QUORUM";

export interface FederationNode { id: string; name: string; endpoint: string; namespace: string; state: FederationNodeState; trustLevel: FederationTrustLevel; capabilities: string[]; version: string; registeredAt: string; updatedAt: string; }
export interface FederationRoute { id: string; namespace: string; nodeId: string; priority: number; enabled: boolean; createdAt: string; }
export interface FederationQuery { id: string; query: string; namespace?: string; mode: FederationQueryMode; minimumTrust: FederationTrustLevel; requestedAt: string; }
export interface FederationResultItem { nodeId: string; knowledgeId: string; score: number; confidence: number; payload: Record<string, unknown>; }
export interface FederationQueryResult { queryId: string; nodesContacted: number; nodesSucceeded: number; items: FederationResultItem[]; quorumMet: boolean; completedAt: string; }
export interface FederationPolicyDecision { allowed: boolean; reason: string; nodeId: string; namespace: string; evaluatedAt: string; }
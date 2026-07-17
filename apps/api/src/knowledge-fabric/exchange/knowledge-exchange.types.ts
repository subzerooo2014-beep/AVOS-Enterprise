export type KnowledgeExchangeParticipantState = "ACTIVE" | "DEGRADED" | "DRAINING" | "OFFLINE";
export type KnowledgeExchangeChannelState = "ACTIVE" | "READ_ONLY" | "SUSPENDED";
export type KnowledgeExchangeConsistency = "EVENTUAL" | "SESSION" | "STRONG";
export type KnowledgeExchangeOfferStrategy = "LOCALITY" | "PRIORITY" | "ROUND_ROBIN" | "BROADCAST";

export interface KnowledgeExchangeParticipant {
  id: string;
  name: string;
  channelId: string;
  endpoint: string;
  state: KnowledgeExchangeParticipantState;
  capabilities: string[];
  weight: number;
  registeredAt: string;
  updatedAt: string;
}

export interface KnowledgeExchangeChannel {
  id: string;
  name: string;
  namespace: string;
  owner: string;
  state: KnowledgeExchangeChannelState;
  consistency: KnowledgeExchangeConsistency;
  createdAt: string;
  updatedAt: string;
}

export interface KnowledgeExchangeOffer {
  id: string;
  namespace: string;
  channelId: string;
  participantId?: string;
  priority: number;
  strategy: KnowledgeExchangeOfferStrategy;
  enabled: boolean;
  createdAt: string;
}

export interface KnowledgeExchangeAccessContract {
  id: string;
  sourceDomainId: string;
  targetDomainId: string;
  namespaces: string[];
  operations: Array<"READ" | "WRITE" | "SYNC">;
  enabled: boolean;
  createdAt: string;
}

export interface KnowledgeExchangeRequest {
  id: string;
  namespace: string;
  operation: "READ" | "WRITE" | "SYNC";
  sourceDomainId: string;
  targetDomainId?: string;
  payload: Record<string, unknown>;
  requestedAt: string;
}

export interface KnowledgeExchangeResponse {
  requestId: string;
  offerId?: string;
  participantId?: string;
  accepted: boolean;
  reason: string;
  consistency: KnowledgeExchangeConsistency;
  completedAt: string;
}
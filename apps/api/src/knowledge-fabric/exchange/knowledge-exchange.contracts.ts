import {
  KnowledgeExchangeChannel,
  KnowledgeExchangeParticipant,
  KnowledgeExchangeRequest,
  KnowledgeExchangeResponse,
  KnowledgeExchangeOffer,
  KnowledgeExchangeAccessContract,
} from "./knowledge-exchange.types";

export interface KnowledgeExchangeRegistryContract {
  registerChannel(input: Omit<KnowledgeExchangeChannel, "id" | "state" | "createdAt" | "updatedAt">): KnowledgeExchangeChannel;
  registerParticipant(input: Omit<KnowledgeExchangeParticipant, "id" | "state" | "registeredAt" | "updatedAt">): KnowledgeExchangeParticipant;
}

export interface KnowledgeExchangeRoutingContract {
  publishOffer(input: Omit<KnowledgeExchangeOffer, "id" | "createdAt">): KnowledgeExchangeOffer;
  discover(namespace: string): KnowledgeExchangeOffer[];
}

export interface KnowledgeExchangePolicyContract {
  createContract(input: Omit<KnowledgeExchangeAccessContract, "id" | "createdAt">): KnowledgeExchangeAccessContract;
  allows(request: KnowledgeExchangeRequest): boolean;
}

export interface KnowledgeExchangeRuntimeContract {
  execute(input: Omit<KnowledgeExchangeRequest, "id" | "requestedAt">): KnowledgeExchangeResponse;
}
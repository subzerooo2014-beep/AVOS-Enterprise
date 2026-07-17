import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { KnowledgeExchangeConsistencyService } from "./knowledge-exchange-consistency.service";
import { KnowledgeExchangeEventService } from "./knowledge-exchange-event.service";
import { KnowledgeExchangeObservabilityService } from "./knowledge-exchange-observability.service";
import { KnowledgeExchangePolicyService } from "./knowledge-exchange-contract.service";
import { KnowledgeExchangeRegistryService } from "./knowledge-exchange-registry.service";
import { KnowledgeExchangeRoutingService } from "./knowledge-exchange-routing.service";
import { KnowledgeExchangeRequest, KnowledgeExchangeResponse } from "./knowledge-exchange.types";

@Injectable()
export class KnowledgeExchangeRuntimeService {
  constructor(
    private readonly registry: KnowledgeExchangeRegistryService,
    private readonly routing: KnowledgeExchangeRoutingService,
    private readonly contracts: KnowledgeExchangePolicyService,
    private readonly consistency: KnowledgeExchangeConsistencyService,
    private readonly events: KnowledgeExchangeEventService,
    private readonly observability: KnowledgeExchangeObservabilityService,
  ) {}

  execute(input: Omit<KnowledgeExchangeRequest, "id" | "requestedAt">): KnowledgeExchangeResponse {
    const request: KnowledgeExchangeRequest = { ...input, id: randomUUID(), requestedAt: new Date().toISOString() };
    const offer = this.routing.select(request.namespace);
    const targetDomainId = request.targetDomainId ?? offer?.channelId;
    const targetDomain = targetDomainId ? this.registry.getDomain(targetDomainId) : undefined;
    const contractAllowed = this.contracts.allows({ ...request, targetDomainId });
    const consistency = targetDomain
      ? this.consistency.evaluate(targetDomain, request.operation)
      : { allowed: false, consistency: "EVENTUAL" as const, channelState: "OFFLINE", evaluatedAt: new Date().toISOString() };
    const accepted = Boolean(offer && targetDomain && contractAllowed && consistency.allowed);
    const reason = !offer
      ? "No exchange offer was found"
      : !targetDomain
        ? "Target exchange channel was not found"
        : !contractAllowed
          ? "Knowledge exchange contract denied the request"
          : !consistency.allowed
            ? "Target channel consistency or state denied the request"
            : "Knowledge exchange request accepted";

    const response: KnowledgeExchangeResponse = {
      requestId: request.id,
      offerId: offer?.id,
      participantId: offer?.participantId,
      accepted,
      reason,
      consistency: consistency.consistency,
      completedAt: new Date().toISOString(),
    };

    this.events.emit("knowledge.exchange.request.completed", { requestId: request.id, accepted, offerId: offer?.id ?? null });
    this.observability.record({ accepted, offerFound: Boolean(offer) });
    return response;
  }
}
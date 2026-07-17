import { Injectable } from "@nestjs/common";
import { KnowledgeExchangeEventService } from "./knowledge-exchange-event.service";
import { KnowledgeExchangeObservabilityService } from "./knowledge-exchange-observability.service";
import { KnowledgeExchangePolicyService } from "./knowledge-exchange-contract.service";
import { KnowledgeExchangeRegistryService } from "./knowledge-exchange-registry.service";
import { KnowledgeExchangeRoutingService } from "./knowledge-exchange-routing.service";

@Injectable()
export class KnowledgeExchangeHealthService {
  constructor(
    private readonly registry: KnowledgeExchangeRegistryService,
    private readonly routing: KnowledgeExchangeRoutingService,
    private readonly contracts: KnowledgeExchangePolicyService,
    private readonly events: KnowledgeExchangeEventService,
    private readonly observability: KnowledgeExchangeObservabilityService,
  ) {}

  status() {
    const counts = this.registry.counts();
    const metrics = this.observability.snapshot();
    return {
      success: true,
      system: "AVOS Knowledge Fabric",
      pack: "KF-9 Knowledge Exchange",
      status: "operational",
      channels: counts.channels,
      participants: counts.participants,
      offers: this.routing.count(),
      contracts: this.contracts.count(),
      events: this.events.count(),
      metrics,
      checkedAt: new Date().toISOString(),
    };
  }
}
import { Module } from "@nestjs/common";
import { KnowledgeExchangeConsistencyService } from "./knowledge-exchange-consistency.service";
import { KnowledgeExchangeController } from "./knowledge-exchange.controller";
import { KnowledgeExchangeEventService } from "./knowledge-exchange-event.service";
import { KnowledgeExchangeHealthService } from "./knowledge-exchange-health.service";
import { KnowledgeExchangeObservabilityService } from "./knowledge-exchange-observability.service";
import { KnowledgeExchangePolicyService } from "./knowledge-exchange-contract.service";
import { KnowledgeExchangeRegistryService } from "./knowledge-exchange-registry.service";
import { KnowledgeExchangeRoutingService } from "./knowledge-exchange-routing.service";
import { KnowledgeExchangeRuntimeService } from "./knowledge-exchange-runtime.service";

@Module({
  controllers: [KnowledgeExchangeController],
  providers: [
    KnowledgeExchangeRegistryService,
    KnowledgeExchangeRoutingService,
    KnowledgeExchangePolicyService,
    KnowledgeExchangeConsistencyService,
    KnowledgeExchangeEventService,
    KnowledgeExchangeObservabilityService,
    KnowledgeExchangeRuntimeService,
    KnowledgeExchangeHealthService,
  ],
  exports: [
    KnowledgeExchangeRegistryService,
    KnowledgeExchangeRoutingService,
    KnowledgeExchangePolicyService,
    KnowledgeExchangeConsistencyService,
    KnowledgeExchangeEventService,
    KnowledgeExchangeObservabilityService,
    KnowledgeExchangeRuntimeService,
    KnowledgeExchangeHealthService,
  ],
})
export class KnowledgeExchangeModule {}
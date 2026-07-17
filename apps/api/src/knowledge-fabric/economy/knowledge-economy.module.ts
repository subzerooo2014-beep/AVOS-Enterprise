import { Module } from "@nestjs/common";
import { KnowledgeAssetEconomyService } from "./knowledge-asset-economy.service";
import { KnowledgeEconomyController } from "./knowledge-economy.controller";
import { KnowledgeEconomyEventService } from "./knowledge-economy-event.service";
import { KnowledgeEconomyHealthService } from "./knowledge-economy-health.service";
import { KnowledgeEconomyObservabilityService } from "./knowledge-economy-observability.service";
import { KnowledgeIncentiveService } from "./knowledge-incentive.service";
import { KnowledgeRevenueDistributionService } from "./knowledge-revenue-distribution.service";
import { KnowledgeRevenueLedgerService } from "./knowledge-revenue-ledger.service";
import { KnowledgeSettlementService } from "./knowledge-settlement.service";
import { KnowledgeValuationService } from "./knowledge-valuation.service";

const providers = [KnowledgeAssetEconomyService, KnowledgeValuationService, KnowledgeRevenueLedgerService, KnowledgeRevenueDistributionService, KnowledgeIncentiveService, KnowledgeSettlementService, KnowledgeEconomyEventService, KnowledgeEconomyObservabilityService, KnowledgeEconomyHealthService];
@Module({ controllers: [KnowledgeEconomyController], providers, exports: providers })
export class KnowledgeEconomyModule {}
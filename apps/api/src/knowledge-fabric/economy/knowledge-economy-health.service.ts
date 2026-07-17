import { Injectable } from "@nestjs/common";
import { KnowledgeAssetEconomyService } from "./knowledge-asset-economy.service";
import { KnowledgeEconomyObservabilityService } from "./knowledge-economy-observability.service";
import { KnowledgeRevenueLedgerService } from "./knowledge-revenue-ledger.service";
import { KnowledgeSettlementService } from "./knowledge-settlement.service";

@Injectable()
export class KnowledgeEconomyHealthService {
  constructor(private readonly assets: KnowledgeAssetEconomyService, private readonly ledger: KnowledgeRevenueLedgerService, private readonly settlements: KnowledgeSettlementService, private readonly metrics: KnowledgeEconomyObservabilityService) {}
  status() { return { success: true, system: "AVOS Knowledge Fabric", pack: "KF-11 Knowledge Economy", status: "operational", assets: this.assets.listAssets().length, revenueEvents: this.ledger.list().length, settlements: this.settlements.list().length, metrics: this.metrics.snapshot(), checkedAt: new Date().toISOString() }; }
}
import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { KnowledgeAssetEconomyService } from "./knowledge-asset-economy.service";
import { KnowledgeEconomyEventService } from "./knowledge-economy-event.service";
import { KnowledgeEconomyHealthService } from "./knowledge-economy-health.service";
import { KnowledgeEconomyObservabilityService } from "./knowledge-economy-observability.service";
import { KnowledgeIncentiveService } from "./knowledge-incentive.service";
import { KnowledgeRevenueDistributionService } from "./knowledge-revenue-distribution.service";
import { KnowledgeRevenueLedgerService } from "./knowledge-revenue-ledger.service";
import { KnowledgeSettlementService } from "./knowledge-settlement.service";
import { IncentiveType, KnowledgeEconomicAsset, KnowledgeRevenueEvent, KnowledgeStakeholderShare } from "./knowledge-economy.types";

@Controller("knowledge-fabric/economy")
export class KnowledgeEconomyController {
  constructor(private readonly assets: KnowledgeAssetEconomyService, private readonly ledger: KnowledgeRevenueLedgerService, private readonly distribution: KnowledgeRevenueDistributionService, private readonly incentives: KnowledgeIncentiveService, private readonly settlements: KnowledgeSettlementService, private readonly events: KnowledgeEconomyEventService, private readonly metrics: KnowledgeEconomyObservabilityService, private readonly health: KnowledgeEconomyHealthService) {}

  @Get("status") status() { return this.health.status(); }
  @Get("assets") listAssets() { return this.assets.listAssets(); }
  @Post("assets") registerAsset(@Body() body: Omit<KnowledgeEconomicAsset, "id" | "state" | "createdAt" | "updatedAt">) { this.metrics.increment("assets.registered"); return this.assets.registerAsset(body); }
  @Post("assets/:id/activate") activate(@Param("id") id: string) { this.events.emit("knowledge.economy.asset.activated", { id }); return this.assets.activateAsset(id); }
  @Get("assets/:id/value") value(@Param("id") id: string) { return { assetId: id, value: this.assets.valueAsset(id) }; }
  @Post("revenue") recordRevenue(@Body() body: Omit<KnowledgeRevenueEvent, "id" | "occurredAt">) { this.metrics.increment("revenue.recorded"); return this.ledger.record(body); }
  @Get("revenue") revenue(@Query("assetId") assetId?: string) { return this.ledger.list(assetId); }
  @Post("assets/:id/shares") configureShares(@Param("id") id: string, @Body() shares: KnowledgeStakeholderShare[]) { return this.distribution.configure(id, shares); }
  @Post("incentives") incentive(@Body() body: { stakeholderId: string; assetId: string; type: IncentiveType; points: number; reason: string }) { return this.incentives.grant(body.stakeholderId, body.assetId, body.type, body.points, body.reason); }
  @Post("settlements") calculateSettlement(@Body() body: { assetId: string; period: string; platformFeeRate?: number }) { this.metrics.increment("settlements.calculated"); return this.settlements.calculate(body.assetId, body.period, body.platformFeeRate); }
  @Post("settlements/:id/approve") approve(@Param("id") id: string) { return this.settlements.approve(id); }
  @Post("settlements/:id/settle") settle(@Param("id") id: string) { this.events.emit("knowledge.economy.settlement.completed", { id }); return this.settlements.settle(id); }
}
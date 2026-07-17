import { KnowledgeEconomicAsset, KnowledgeRevenueEvent, KnowledgeSettlement } from "./knowledge-economy.types";

export interface KnowledgeAssetEconomyContract {
  registerAsset(input: Omit<KnowledgeEconomicAsset, "id" | "state" | "createdAt" | "updatedAt">): KnowledgeEconomicAsset;
  activateAsset(id: string): KnowledgeEconomicAsset;
  valueAsset(id: string): number;
}

export interface KnowledgeSettlementContract {
  recordRevenue(input: Omit<KnowledgeRevenueEvent, "id" | "occurredAt">): KnowledgeRevenueEvent;
  calculateSettlement(assetId: string, period: string): KnowledgeSettlement;
  settle(id: string): KnowledgeSettlement;
}
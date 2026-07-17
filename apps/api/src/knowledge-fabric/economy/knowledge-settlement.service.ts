import { Injectable, NotFoundException } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { KnowledgeSettlement } from "./knowledge-economy.types";
import { KnowledgeRevenueDistributionService } from "./knowledge-revenue-distribution.service";
import { KnowledgeRevenueLedgerService } from "./knowledge-revenue-ledger.service";

@Injectable()
export class KnowledgeSettlementService {
  private readonly settlements = new Map<string, KnowledgeSettlement>();
  constructor(private readonly ledger: KnowledgeRevenueLedgerService, private readonly distribution: KnowledgeRevenueDistributionService) {}

  calculate(assetId: string, period: string, platformFeeRate = 0.1): KnowledgeSettlement {
    const grossRevenue = this.ledger.total(assetId, period);
    const platformFee = Number((grossRevenue * Math.max(0, Math.min(1, platformFeeRate))).toFixed(2));
    const distributableRevenue = Number((grossRevenue - platformFee).toFixed(2));
    const settlement: KnowledgeSettlement = { id: randomUUID(), assetId, period, grossRevenue, platformFee, distributableRevenue, currency: "USD", shares: this.distribution.distribute(assetId, distributableRevenue), state: "CALCULATED", createdAt: new Date().toISOString() };
    this.settlements.set(settlement.id, settlement);
    return structuredClone(settlement);
  }

  approve(id: string): KnowledgeSettlement { const item = this.require(id); item.state = "APPROVED"; return structuredClone(item); }
  settle(id: string): KnowledgeSettlement { const item = this.require(id); item.state = "SETTLED"; item.settledAt = new Date().toISOString(); return structuredClone(item); }
  list(): KnowledgeSettlement[] { return [...this.settlements.values()].map((item) => structuredClone(item)); }

  private require(id: string): KnowledgeSettlement {
    const item = this.settlements.get(id);
    if (!item) throw new NotFoundException(`Knowledge settlement ${id} was not found.`);
    return item;
  }
}
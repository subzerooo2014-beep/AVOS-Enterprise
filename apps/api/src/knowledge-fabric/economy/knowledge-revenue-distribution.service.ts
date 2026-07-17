import { BadRequestException, Injectable } from "@nestjs/common";
import { KnowledgeStakeholderShare } from "./knowledge-economy.types";

@Injectable()
export class KnowledgeRevenueDistributionService {
  private readonly shares = new Map<string, KnowledgeStakeholderShare[]>();

  configure(assetId: string, shares: KnowledgeStakeholderShare[]): KnowledgeStakeholderShare[] {
    const total = shares.reduce((sum, share) => sum + share.percentage, 0);
    if (Math.abs(total - 100) > 0.0001) throw new BadRequestException("Stakeholder percentages must equal 100.");
    if (shares.some((share) => share.percentage < 0)) throw new BadRequestException("Stakeholder percentages cannot be negative.");
    this.shares.set(assetId, shares.map((share) => ({ ...share })));
    return this.get(assetId);
  }

  get(assetId: string): KnowledgeStakeholderShare[] {
    return (this.shares.get(assetId) ?? []).map((share) => ({ ...share }));
  }

  distribute(assetId: string, amount: number): Array<KnowledgeStakeholderShare & { amount: number }> {
    return this.get(assetId).map((share) => ({ ...share, amount: Number((amount * share.percentage / 100).toFixed(2)) }));
  }
}
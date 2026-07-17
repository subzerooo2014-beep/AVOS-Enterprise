import { Injectable } from "@nestjs/common";
import { KnowledgeEconomicAsset } from "./knowledge-economy.types";

@Injectable()
export class KnowledgeValuationService {
  calculate(asset: KnowledgeEconomicAsset, demandIndex = 1, freshnessIndex = 1): number {
    const quality = asset.qualityScore / 100;
    const reuse = asset.reuseScore / 100;
    const impact = asset.impactScore / 100;
    const scarcity = asset.scarcityScore / 100;
    const intrinsic = asset.unitValue * (0.35 * quality + 0.25 * reuse + 0.25 * impact + 0.15 * scarcity);
    return Number((intrinsic * Math.max(0.1, demandIndex) * Math.max(0.1, freshnessIndex)).toFixed(2));
  }
}
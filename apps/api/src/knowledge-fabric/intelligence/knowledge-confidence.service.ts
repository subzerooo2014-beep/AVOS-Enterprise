import { Injectable } from "@nestjs/common";
import { KnowledgeSemanticMatch } from "./knowledge-intelligence.types";

@Injectable()
export class KnowledgeConfidenceService {
  calculate(matches: KnowledgeSemanticMatch[]): number {
    if (!matches.length) return 0;
    const weighted = matches.reduce((sum, match, index) => sum + match.finalScore * (1 / (index + 1)), 0);
    const weights = matches.reduce((sum, _match, index) => sum + 1 / (index + 1), 0);
    const sourceTrust = matches.reduce((sum, match) => sum + match.item.trustScore * match.item.confidenceScore, 0) / matches.length;
    return Number(Math.max(0, Math.min(1, (weighted / weights) * 0.65 + sourceTrust * 0.35)).toFixed(4));
  }
}
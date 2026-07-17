import { Injectable } from "@nestjs/common";
import { KnowledgeSemanticMatch } from "./knowledge-intelligence.types";

@Injectable()
export class KnowledgeRecommendationService {
  recommend(matches: KnowledgeSemanticMatch[], limit = 5) {
    return matches.slice(0, Math.max(1, limit)).map((match, index) => ({
      rank: index + 1,
      knowledgeId: match.item.knowledgeId,
      name: match.item.name,
      score: match.finalScore,
      rationale: match.reasons.join(", ") || "ranked knowledge",
    }));
  }
}
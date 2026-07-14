import { Injectable } from "@nestjs/common";
import { IntelligenceRecommendation } from "../ultra-ai-commerce.types";
import { makeId } from "../ultra-ai-commerce.utils";

@Injectable()
export class RecommendationEngine {
  create(items: Array<Omit<IntelligenceRecommendation, "id" | "createdAt">>) {
    return items
      .map((item) => ({ ...item, id: makeId("rec"), createdAt: new Date().toISOString() }))
      .sort((a, b) => b.priority - a.priority || b.score - a.score);
  }
}

import { Injectable } from "@nestjs/common";
import { round } from "../ultra-ai-commerce.utils";

@Injectable()
export class InspectionIntelligenceEngine {
  summarize(input: Record<string, number>) {
    const values = Object.values(input);
    const score = values.reduce((a, b) => a + b, 0) / Math.max(1, values.length);
    return { inspectionScore: round(score), decision: score >= 75 ? "PASS" : score >= 55 ? "REVIEW" : "FAIL" };
  }
}

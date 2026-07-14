import { Injectable } from "@nestjs/common";

@Injectable()
export class DecisionOrchestratorEngine {
  combine(inputs: Array<{ name: string; score: number; weight: number }>) {
    const totalWeight = inputs.reduce((sum, item) => sum + item.weight, 0) || 1;
    const score = inputs.reduce((sum, item) => sum + item.score * item.weight, 0) / totalWeight;
    return { score: Math.round(score), decision: score >= 70 ? "APPROVE" : score >= 45 ? "REVIEW" : "DECLINE", inputs };
  }
}

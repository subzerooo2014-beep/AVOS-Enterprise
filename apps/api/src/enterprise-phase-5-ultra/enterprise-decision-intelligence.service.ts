import { Injectable } from "@nestjs/common";
@Injectable()
export class EnterpriseDecisionIntelligenceService {
  decide(contextScore = 90, riskScore = 20) {
    const confidence = Math.max(0, Math.min(100, Math.round(contextScore * 0.8 + (100 - riskScore) * 0.2)));
    return { action: confidence >= 80 ? "EXECUTE" : confidence >= 60 ? "PILOT" : "BLOCK", confidence, approved: confidence >= 60, decidedAt: new Date().toISOString() };
  }
}
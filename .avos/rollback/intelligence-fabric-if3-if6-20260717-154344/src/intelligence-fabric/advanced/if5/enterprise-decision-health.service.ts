import { Injectable } from "@nestjs/common";
import { EnterpriseDecisionIntelligenceService } from "./enterprise-decision-intelligence.service";

@Injectable()
export class EnterpriseDecisionHealthService {
  constructor(
    private readonly decisions: EnterpriseDecisionIntelligenceService,
  ) {}

  snapshot(): Record<string, unknown> {
    return {
      status: "healthy",
      totalDecisions: this.decisions.count(),
      checkedAt: new Date().toISOString(),
    };
  }
}
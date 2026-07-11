import { Injectable } from "@nestjs/common";
import { AiResultsService } from "../ai-results/ai-results.service";
import { AiDecisionHistoryService } from "../ai-decision-history/ai-decision-history.service";

@Injectable()
export class AiDecisionService {
  constructor(
    private readonly results: AiResultsService,
    private readonly history: AiDecisionHistoryService,
  ) {}

  async evaluateVehicle(vehicleId: string) {
    const items = await this.results.getVehicleResults(vehicleId);

    const map = new Map<string, any>();

    for (const item of items) {
      map.set(item.taskType, item.output?.result ?? {});
    }

    const valuation = map.get("vehicle_valuation") ?? {};
    const fraud = map.get("fraud_assessment") ?? {};
    const trust = map.get("trust_profile") ?? {};
    const buyer = map.get("buyer_matching") ?? {};
    const marketing = map.get("marketing_campaign") ?? {};
    const exportOpportunity = map.get("export_opportunity_check") ?? {};

    const actions: string[] = [];

    if (fraud.decision === "allow") actions.push("ALLOW_LISTING");
    if ((trust.trustScore ?? 0) >= 90) actions.push("TRUST_BADGE");
    if ((buyer.matchScore ?? 0) >= 85) actions.push("PROMOTE_TO_MATCHED_BUYERS");
    if (marketing.recommendedAction === "launch_now") actions.push("START_MARKETING");
    if ((exportOpportunity.exportScore ?? 0) >= 85) actions.push("ENABLE_EXPORT");

    const decision = {
      overallDecision: fraud.decision === "allow" ? "APPROVED" : "REVIEW",
      recommendedPrice: valuation.recommendedPrice ?? null,
      estimatedPrice: valuation.estimatedPrice ?? null,
      actions,
      summary: {
        fraud,
        trust,
        buyer,
        marketing,
        exportOpportunity,
        valuation,
      },
    };

    try {
      await this.history.saveDecision(vehicleId, decision);
    } catch {
      // History table may not exist yet during first migration phase.
    }

    return decision;
  }
}

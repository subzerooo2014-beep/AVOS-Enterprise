import { Injectable } from "@nestjs/common";
import {
  SmartVehicleRuleContext,
  SmartVehicleRuleResult,
} from "./smart-vehicle-rules.types";

@Injectable()
export class SmartVehicleRulesEngineService {
  evaluate(
    context: SmartVehicleRuleContext,
  ): SmartVehicleRuleResult {
    const triggeredRules: string[] = [];
    const actions: string[] = [];

    if (context.fraudRisk === "HIGH") {
      triggeredRules.push("block-high-fraud-risk");
      actions.push("block-publication");
    }

    if (!context.inspectionPassed) {
      triggeredRules.push("inspection-required");
      actions.push("request-inspection");
    }

    if (context.qualityScore < 60) {
      triggeredRules.push("minimum-quality-not-met");
      actions.push("improve-listing-quality");
    }

    if (context.trustScore < 50) {
      triggeredRules.push("low-trust-score");
      actions.push("manual-trust-review");
    }

    const ruleScore = Math.round(
      context.qualityScore * 0.3 +
        context.trustScore * 0.25 +
        context.recommendationScore * 0.25 +
        (context.inspectionPassed ? 20 : 0),
    );

    return {
      allowed: triggeredRules.length === 0 && ruleScore >= 70,
      ruleScore,
      triggeredRules,
      actions,
    };
  }
}

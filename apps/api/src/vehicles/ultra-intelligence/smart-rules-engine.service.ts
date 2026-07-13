import { Injectable } from "@nestjs/common";
import {
  SmartRulesContext,
  SmartRulesResult,
} from "./smart-rules.types";

@Injectable()
export class SmartRulesEngineService {
  evaluate(context: SmartRulesContext): SmartRulesResult {
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
    }

    if (context.trustScore < 50) {
      triggeredRules.push("low-trust-score");
    }

    return {
      allowed: triggeredRules.length === 0,
      triggeredRules,
      actions,
    };
  }
}

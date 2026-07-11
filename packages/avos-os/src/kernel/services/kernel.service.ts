import { AvosDecision, AvosDecisionInput } from "../contracts/decision";
import { AvosRule } from "../contracts/rule";
import { RuleRegistry } from "../registry/rule.registry";

export class AvosKernelService {
  private readonly rules = new RuleRegistry();

  constructor() {
    this.rules.register(this.vehicleCreatedRule());
  }

  decide(input: AvosDecisionInput): AvosDecision {
    const matchedRules = this.rules.resolve(input);
    const actions = matchedRules.flatMap((rule) => rule.evaluate(input));

    if (actions.length === 0) {
      return {
        accepted: true,
        confidence: 50,
        workflow: "log_only",
        actions: ["log_only"],
        reason: "No matching workflow rules found.",
      };
    }

    return {
      accepted: true,
      confidence: 90,
      workflow: input.event,
      actions,
      reason: "Kernel selected workflow actions based on matching rules.",
    };
  }

  private vehicleCreatedRule(): AvosRule {
    return {
      name: "vehicle.created.rule",

      supports(input: AvosDecisionInput) {
        return input.event === "VehicleCreated" || input.entityType === "vehicle";
      },

      evaluate() {
        return [
          "vehicle_valuation",
          "fraud_assessment",
          "trust_profile",
          "buyer_matching",
          "marketing_campaign",
          "export_opportunity_check",
        ];
      },
    };
  }
}

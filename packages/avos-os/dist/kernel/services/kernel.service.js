"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvosKernelService = void 0;
const rule_registry_1 = require("../registry/rule.registry");
class AvosKernelService {
    rules = new rule_registry_1.RuleRegistry();
    constructor() {
        this.rules.register(this.vehicleCreatedRule());
    }
    decide(input) {
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
    vehicleCreatedRule() {
        return {
            name: "vehicle.created.rule",
            supports(input) {
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
exports.AvosKernelService = AvosKernelService;

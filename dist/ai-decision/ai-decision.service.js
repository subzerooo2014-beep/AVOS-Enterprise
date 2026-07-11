"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiDecisionService = void 0;
const common_1 = require("@nestjs/common");
const ai_results_service_1 = require("../ai-results/ai-results.service");
const ai_decision_history_service_1 = require("../ai-decision-history/ai-decision-history.service");
let AiDecisionService = class AiDecisionService {
    constructor(results, history) {
        this.results = results;
        this.history = history;
    }
    async evaluateVehicle(vehicleId) {
        const items = await this.results.getVehicleResults(vehicleId);
        const map = new Map();
        for (const item of items) {
            map.set(item.taskType, item.output?.result ?? {});
        }
        const valuation = map.get("vehicle_valuation") ?? {};
        const fraud = map.get("fraud_assessment") ?? {};
        const trust = map.get("trust_profile") ?? {};
        const buyer = map.get("buyer_matching") ?? {};
        const marketing = map.get("marketing_campaign") ?? {};
        const exportOpportunity = map.get("export_opportunity_check") ?? {};
        const actions = [];
        if (fraud.decision === "allow")
            actions.push("ALLOW_LISTING");
        if ((trust.trustScore ?? 0) >= 90)
            actions.push("TRUST_BADGE");
        if ((buyer.matchScore ?? 0) >= 85)
            actions.push("PROMOTE_TO_MATCHED_BUYERS");
        if (marketing.recommendedAction === "launch_now")
            actions.push("START_MARKETING");
        if ((exportOpportunity.exportScore ?? 0) >= 85)
            actions.push("ENABLE_EXPORT");
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
        }
        catch {
        }
        return decision;
    }
};
exports.AiDecisionService = AiDecisionService;
exports.AiDecisionService = AiDecisionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [ai_results_service_1.AiResultsService,
        ai_decision_history_service_1.AiDecisionHistoryService])
], AiDecisionService);
//# sourceMappingURL=ai-decision.service.js.map
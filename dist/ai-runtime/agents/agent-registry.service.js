"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentRegistryService = void 0;
const export_opportunity_agent_1 = require("./export-opportunity.agent");
const marketing_campaign_agent_1 = require("./marketing-campaign.agent");
const buyer_matching_agent_1 = require("./buyer-matching.agent");
const trust_profile_agent_1 = require("./trust-profile.agent");
const common_1 = require("@nestjs/common");
const vehicle_valuation_agent_1 = require("./vehicle-valuation.agent");
const fraud_assessment_agent_1 = require("./fraud-assessment.agent");
const generic_vehicle_agent_1 = require("./generic-vehicle.agent");
let AgentRegistryService = class AgentRegistryService {
    constructor() {
        this.agents = [
            new vehicle_valuation_agent_1.VehicleValuationAgent(),
            new fraud_assessment_agent_1.FraudAssessmentAgent(),
            new trust_profile_agent_1.TrustProfileAgent(),
            new buyer_matching_agent_1.BuyerMatchingAgent(),
            new marketing_campaign_agent_1.MarketingCampaignAgent(),
            new export_opportunity_agent_1.ExportOpportunityAgent(),
            new generic_vehicle_agent_1.GenericVehicleAgent(),
        ];
    }
    find(taskType) {
        return this.agents.find((agent) => agent.supports(taskType));
    }
};
exports.AgentRegistryService = AgentRegistryService;
exports.AgentRegistryService = AgentRegistryService = __decorate([
    (0, common_1.Injectable)()
], AgentRegistryService);
//# sourceMappingURL=agent-registry.service.js.map
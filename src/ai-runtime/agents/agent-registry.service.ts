import { ExportOpportunityAgent } from "./export-opportunity.agent";
import { MarketingCampaignAgent } from "./marketing-campaign.agent";
import { BuyerMatchingAgent } from "./buyer-matching.agent";
import { TrustProfileAgent } from "./trust-profile.agent";
import { Injectable } from "@nestjs/common";
import { AiAgent } from "./agent.interface";
import { VehicleValuationAgent } from "./vehicle-valuation.agent";
import { FraudAssessmentAgent } from "./fraud-assessment.agent";
import { GenericVehicleAgent } from "./generic-vehicle.agent";

@Injectable()
export class AgentRegistryService {
  private readonly agents: AiAgent[] = [
    new VehicleValuationAgent(),
    new FraudAssessmentAgent(),
    new TrustProfileAgent(),
    new BuyerMatchingAgent(),
    new MarketingCampaignAgent(),
    new ExportOpportunityAgent(),
    new GenericVehicleAgent(),
  ];

  find(taskType: string) {
    return this.agents.find((agent) => agent.supports(taskType));
  }
}



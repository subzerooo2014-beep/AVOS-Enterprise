import { Module } from "@nestjs/common";
import { BuyerMatchingAiService } from "./buyer-matching-ai.service";
import { DealerIntelligenceService } from "./dealer-intelligence.service";
import { VehicleRecommendationIntelligenceService } from "./vehicle-recommendation-intelligence.service";
import { InspectionWorkflowAiService } from "./inspection-workflow-ai.service";
import { SmartVehicleRulesEngineService } from "./smart-vehicle-rules-engine.service";

@Module({
  providers: [
    BuyerMatchingAiService,
    DealerIntelligenceService,
    VehicleRecommendationIntelligenceService,
    InspectionWorkflowAiService,
    SmartVehicleRulesEngineService,
  ],
  exports: [
    BuyerMatchingAiService,
    DealerIntelligenceService,
    VehicleRecommendationIntelligenceService,
    InspectionWorkflowAiService,
    SmartVehicleRulesEngineService,
  ],
})
export class VehicleBuyerIntelligenceModule {}

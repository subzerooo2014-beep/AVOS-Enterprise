import { Module } from "@nestjs/common";
import { VehicleDecisionGraphService } from "./vehicle-decision-graph.service";
import { VehicleAutomationOrchestratorService } from "./vehicle-automation-orchestrator.service";
import { VehicleEnterpriseAnalyticsService } from "./vehicle-enterprise-analytics.service";
import { VehicleEvolutionPlannerService } from "./vehicle-evolution-planner.service";
import { VehicleEnterpriseIntegrationService } from "./vehicle-enterprise-integration.service";

@Module({
  providers: [
    VehicleDecisionGraphService,
    VehicleAutomationOrchestratorService,
    VehicleEnterpriseAnalyticsService,
    VehicleEvolutionPlannerService,
    VehicleEnterpriseIntegrationService,
  ],
  exports: [
    VehicleDecisionGraphService,
    VehicleAutomationOrchestratorService,
    VehicleEnterpriseAnalyticsService,
    VehicleEvolutionPlannerService,
    VehicleEnterpriseIntegrationService,
  ],
})
export class VehicleEnterpriseAutomationModule {}

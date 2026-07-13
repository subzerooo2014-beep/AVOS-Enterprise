import { Module } from "@nestjs/common";
import { VehicleContextMemoryService } from "./vehicle-context-memory.service";
import { VehicleScenarioSimulationService } from "./vehicle-scenario-simulation.service";
import { VehicleRegulationAdaptationService } from "./vehicle-regulation-adaptation.service";
import { VehicleCapabilityFusionService } from "./vehicle-capability-fusion.service";
import { VehicleValueCreationService } from "./vehicle-value-creation.service";
import { VehicleResourceOptimizationService } from "./vehicle-resource-optimization.service";
import { VehicleCustomerJourneyService } from "./vehicle-customer-journey.service";
import { VehicleServiceOrchestrationService } from "./vehicle-service-orchestration.service";
import { VehicleCollaborationMeshService } from "./vehicle-collaboration-mesh.service";
import { VehiclePlatformEvolutionService } from "./vehicle-platform-evolution.service";

@Module({
  providers: [
    VehicleContextMemoryService,
    VehicleScenarioSimulationService,
    VehicleRegulationAdaptationService,
    VehicleCapabilityFusionService,
    VehicleValueCreationService,
    VehicleResourceOptimizationService,
    VehicleCustomerJourneyService,
    VehicleServiceOrchestrationService,
    VehicleCollaborationMeshService,
    VehiclePlatformEvolutionService,
  ],
  exports: [
    VehicleContextMemoryService,
    VehicleScenarioSimulationService,
    VehicleRegulationAdaptationService,
    VehicleCapabilityFusionService,
    VehicleValueCreationService,
    VehicleResourceOptimizationService,
    VehicleCustomerJourneyService,
    VehicleServiceOrchestrationService,
    VehicleCollaborationMeshService,
    VehiclePlatformEvolutionService,
  ],
})
export class VehicleAdaptivePlatformModule {}

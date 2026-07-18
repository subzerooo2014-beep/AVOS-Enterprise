import { Module } from "@nestjs/common";
import { PlatformControlPlaneModule } from "../platform-control-plane/platform-control-plane.module";
import { PlatformDependencyTopologyController } from "./platform-dependency-topology.controller";
import { PlatformDependencyGraphService } from "./services/platform-dependency-graph.service";
import { PlatformDependencyIdService } from "./services/platform-dependency-id.service";
import { PlatformDependencyRegistryService } from "./services/platform-dependency-registry.service";
import { PlatformDependencyTopologyService } from "./services/platform-dependency-topology.service";
import { PlatformDependencyValidationService } from "./services/platform-dependency-validation.service";
import { PlatformExecutionPlannerService } from "./services/platform-execution-planner.service";
import { PlatformImpactAnalysisService } from "./services/platform-impact-analysis.service";
import { PlatformTopologyAnalysisService } from "./services/platform-topology-analysis.service";

@Module({
  imports: [PlatformControlPlaneModule],
  controllers: [PlatformDependencyTopologyController],
  providers: [
    PlatformDependencyIdService,
    PlatformDependencyRegistryService,
    PlatformDependencyGraphService,
    PlatformDependencyValidationService,
    PlatformExecutionPlannerService,
    PlatformImpactAnalysisService,
    PlatformTopologyAnalysisService,
    PlatformDependencyTopologyService
  ],
  exports: [
    PlatformDependencyRegistryService,
    PlatformDependencyGraphService,
    PlatformDependencyValidationService,
    PlatformExecutionPlannerService,
    PlatformImpactAnalysisService,
    PlatformTopologyAnalysisService,
    PlatformDependencyTopologyService
  ]
})
export class PlatformDependencyTopologyModule {}
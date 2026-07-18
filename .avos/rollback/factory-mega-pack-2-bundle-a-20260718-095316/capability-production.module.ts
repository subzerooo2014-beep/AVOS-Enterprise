import { Module } from "@nestjs/common";
import { CapabilityBlueprintRegistryService } from "./capability-blueprint-registry.service";
import { CapabilitySpecificationCompilerService } from "./capability-specification-compiler.service";
import { CapabilityDependencyPlannerService } from "./capability-dependency-planner.service";
import { CapabilityContractGeneratorService } from "./capability-contract-generator.service";
import { CapabilityCodeGeneratorService } from "./capability-code-generator.service";
import { CapabilityTestGeneratorService } from "./capability-test-generator.service";
import { CapabilityGovernanceValidatorService } from "./capability-governance-validator.service";
import { CapabilityProductionCertificationService } from "./capability-production-certification.service";
import { CapabilityReleasePackagerService } from "./capability-release-packager.service";
import { CapabilityProductionOrchestratorService } from "./capability-production-orchestrator.service";
import { CapabilityProductionSmokeService } from "./capability-production-smoke.service";
import { CapabilityProductionController } from "./capability-production.controller";

@Module({
  controllers: [CapabilityProductionController],
  providers: [
    CapabilityBlueprintRegistryService,
    CapabilitySpecificationCompilerService,
    CapabilityDependencyPlannerService,
    CapabilityContractGeneratorService,
    CapabilityCodeGeneratorService,
    CapabilityTestGeneratorService,
    CapabilityGovernanceValidatorService,
    CapabilityProductionCertificationService,
    CapabilityReleasePackagerService,
    CapabilityProductionOrchestratorService,
    CapabilityProductionSmokeService
  ],
  exports: [
    CapabilityBlueprintRegistryService,
    CapabilityProductionOrchestratorService,
    CapabilityProductionCertificationService,
    CapabilityReleasePackagerService
  ]
})
export class CapabilityProductionModule {}

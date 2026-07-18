import { CapabilityValidationGeneratorService } from "./capability-validation-generator.service";
import { CapabilityUnitTestGeneratorService } from "./capability-unit-test-generator.service";
import { CapabilityProductionMegaBundleCService } from "./capability-production-mega-bundle-c.service";
import { CapabilityProductionMegaBundleCController } from "./capability-production-mega-bundle-c.controller";
import { CapabilityIntegrationTestGeneratorService } from "./capability-integration-test-generator.service";
import { CapabilityDtoGeneratorService } from "./capability-dto-generator.service";
import { CapabilityControllerGeneratorService } from "./capability-controller-generator.service";
import { CapabilityBuildExecutionEngineService } from "./capability-build-execution-engine.service";
import { PhysicalFileWriterService } from "./physical-file-writer.service";
import { NestjsModuleComposerService } from "./nestjs-module-composer.service";
import { CapabilityWorkspaceBuilderService } from "./capability-workspace-builder.service";
import { CapabilityProductionBundleBService } from "./capability-production-bundle-b.service";
import { CapabilityProductionBundleBController } from "./capability-production-bundle-b.controller";
import { Module } from "@nestjs/common";
import { CapabilityArtifactRepositoryService } from "./capability-artifact-repository.service";
import { CapabilityProductionPathsService } from "./capability-production-paths.service";
import { CapabilityProductionPersistenceController } from "./capability-production-persistence.controller";
import { GeneratedSourceMaterializerService } from "./generated-source-materializer.service";
import { PersistentProductionRegistryService } from "./persistent-production-registry.service";

@Module({
  controllers: [CapabilityProductionMegaBundleCController, CapabilityProductionBundleBController, CapabilityProductionPersistenceController],
  providers: [CapabilityProductionMegaBundleCService, CapabilityBuildExecutionEngineService, CapabilityIntegrationTestGeneratorService, CapabilityUnitTestGeneratorService, CapabilityValidationGeneratorService, CapabilityDtoGeneratorService, CapabilityControllerGeneratorService, CapabilityProductionBundleBService, NestjsModuleComposerService, CapabilityWorkspaceBuilderService, PhysicalFileWriterService, 
    CapabilityProductionPathsService,
    PersistentProductionRegistryService,
    CapabilityArtifactRepositoryService,
    GeneratedSourceMaterializerService
  ],
  exports: [CapabilityProductionMegaBundleCService, CapabilityBuildExecutionEngineService, CapabilityIntegrationTestGeneratorService, CapabilityUnitTestGeneratorService, CapabilityValidationGeneratorService, CapabilityDtoGeneratorService, CapabilityControllerGeneratorService, CapabilityProductionBundleBService, NestjsModuleComposerService, CapabilityWorkspaceBuilderService, PhysicalFileWriterService, 
    PersistentProductionRegistryService,
    CapabilityArtifactRepositoryService,
    GeneratedSourceMaterializerService
  ]
})
export class CapabilityProductionPersistenceModule {}




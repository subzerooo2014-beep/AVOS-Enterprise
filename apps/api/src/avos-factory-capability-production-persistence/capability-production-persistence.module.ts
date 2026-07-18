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
  controllers: [CapabilityProductionBundleBController, CapabilityProductionPersistenceController],
  providers: [CapabilityProductionBundleBService, NestjsModuleComposerService, CapabilityWorkspaceBuilderService, PhysicalFileWriterService, 
    CapabilityProductionPathsService,
    PersistentProductionRegistryService,
    CapabilityArtifactRepositoryService,
    GeneratedSourceMaterializerService
  ],
  exports: [CapabilityProductionBundleBService, NestjsModuleComposerService, CapabilityWorkspaceBuilderService, PhysicalFileWriterService, 
    PersistentProductionRegistryService,
    CapabilityArtifactRepositoryService,
    GeneratedSourceMaterializerService
  ]
})
export class CapabilityProductionPersistenceModule {}



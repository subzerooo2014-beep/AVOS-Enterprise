import { Module } from "@nestjs/common";
import { FactoryEventsModule } from "../events/events.module";
import { FactoryRegistryModule } from "../registry/registry.module";
import { FactoryWorkspaceModule } from "../workspace/workspace.module";
import { FactoryBlueprintIrService } from "./blueprint-ir.service";
import { FactoryFilePlannerService } from "./file-planner.service";
import { FactoryGenerationEngineService } from "./generation-engine.service";
import { FactoryGenerationJobService } from "./generation-job.service";
import { FactoryGenerationPackageService } from "./package.service";
import { FactoryGenerationValidatorService } from "./generation-validator.service";
import { FactorySourceGeneratorService } from "./source-generator.service";
import { FactoryTemplateRendererService } from "./template-renderer.service";

@Module({
  imports: [
    FactoryWorkspaceModule,
    FactoryRegistryModule,
    FactoryEventsModule,
  ],
  providers: [
    FactoryBlueprintIrService,
    FactoryFilePlannerService,
    FactoryGenerationEngineService,
    FactoryGenerationJobService,
    FactoryGenerationPackageService,
    FactoryGenerationValidatorService,
    FactorySourceGeneratorService,
    FactoryTemplateRendererService,
  ],
  exports: [
    FactoryBlueprintIrService,
    FactoryFilePlannerService,
    FactoryGenerationEngineService,
    FactoryGenerationJobService,
    FactoryGenerationPackageService,
    FactoryGenerationValidatorService,
    FactorySourceGeneratorService,
    FactoryTemplateRendererService,
  ],
})
export class FactoryGenerationModule {}

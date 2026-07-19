import { Module } from "@nestjs/common";
import { FactoryEventsModule } from "../events/events.module";
import { FactoryGenerationModule } from "../generation/generation.module";
import { FactoryWorkspaceModule } from "../workspace/workspace.module";
import { FactoryBuildEngineService } from "./build-engine.service";
import { FactoryCapabilityGeneratorService } from "./capability-generator.service";
import { FactoryCommandRunnerService } from "./command-runner.service";
import { FactoryMaterializerService } from "./materializer.service";
import { FactoryOutputPackagerService } from "./output-packager.service";
import { FactoryProjectScaffolderService } from "./scaffolder.service";
import { FactoryRollbackService } from "./rollback.service";
import { FactoryProductionVerificationService } from "./verification.service";
import { FactoryWorkspacePathService } from "./workspace-path.service";

@Module({
  imports: [
    FactoryGenerationModule,
    FactoryWorkspaceModule,
    FactoryEventsModule,
  ],
  providers: [
    FactoryBuildEngineService,
    FactoryCapabilityGeneratorService,
    FactoryCommandRunnerService,
    FactoryMaterializerService,
    FactoryOutputPackagerService,
    FactoryProjectScaffolderService,
    FactoryRollbackService,
    FactoryProductionVerificationService,
    FactoryWorkspacePathService,
  ],
  exports: [
    FactoryBuildEngineService,
    FactoryCapabilityGeneratorService,
    FactoryCommandRunnerService,
    FactoryMaterializerService,
    FactoryOutputPackagerService,
    FactoryProjectScaffolderService,
    FactoryRollbackService,
    FactoryProductionVerificationService,
    FactoryWorkspacePathService,
  ],
})
export class FactoryProductionModule {}

import { Module } from "@nestjs/common";
import { FactoryAutonomousController } from "./api/autonomous.controller";
import { FactoryEventsController } from "./api/events.controller";
import { FactoryController } from "./api/factory.controller";
import { FactoryGenerationController } from "./api/generation.controller";
import { FactoryProductionController } from "./api/production.controller";
import { FactoryRegistryController } from "./api/registry.controller";
import { FactoryWorkspaceController } from "./api/workspace.controller";
import { FactoryAutonomousModule } from "./autonomous/autonomous.module";
import { FactoryEventsModule } from "./events/events.module";
import { FactoryGenerationModule } from "./generation/generation.module";
import { FactoryKernelModule } from "./kernel/factory-kernel.module";
import { FactoryProductionModule } from "./production/production.module";
import { FactoryRegistryModule } from "./registry/registry.module";
import { FactoryRuntimeModule } from "./runtime/runtime.module";
import { FactoryWorkspaceModule } from "./workspace/workspace.module";

@Module({
  imports: [
    FactoryAutonomousModule,
    FactoryRuntimeModule,
    FactoryKernelModule,
    FactoryEventsModule,
    FactoryWorkspaceModule,
    FactoryRegistryModule,
    FactoryGenerationModule,
    FactoryProductionModule,
  ],
  controllers: [
    FactoryAutonomousController,
    FactoryController,
    FactoryWorkspaceController,
    FactoryRegistryController,
    FactoryEventsController,
    FactoryGenerationController,
    FactoryProductionController,
  ],
  exports: [
    FactoryAutonomousModule,
    FactoryRuntimeModule,
    FactoryKernelModule,
    FactoryEventsModule,
    FactoryWorkspaceModule,
    FactoryRegistryModule,
    FactoryGenerationModule,
    FactoryProductionModule,
  ],
})
export class AvosCodeFactoryModule {}

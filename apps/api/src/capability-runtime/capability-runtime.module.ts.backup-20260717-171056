import { Module } from "@nestjs/common";
import { CapabilityFabricModule } from "../capability-fabric/capability-fabric.module";
import { CapabilityRuntimeCacheService } from "./capability-runtime-cache.service";
import { CapabilityRuntimeContextService } from "./capability-runtime-context.service";
import { CapabilityRuntimeController } from "./capability-runtime.controller";
import { CapabilityRuntimeLoaderService } from "./capability-runtime-loader.service";
import { CapabilityRuntimeObservabilityService } from "./capability-runtime-observability.service";
import { CapabilityRuntimeResolverService } from "./capability-runtime-resolver.service";
import { CapabilityRuntimeService } from "./capability-runtime.service";

@Module({
  imports: [CapabilityFabricModule],
  controllers: [CapabilityRuntimeController],
  providers: [
    CapabilityRuntimeService,
    CapabilityRuntimeLoaderService,
    CapabilityRuntimeResolverService,
    CapabilityRuntimeContextService,
    CapabilityRuntimeObservabilityService,
    CapabilityRuntimeCacheService,
  ],
  exports: [
    CapabilityRuntimeService,
    CapabilityRuntimeResolverService,
    CapabilityRuntimeObservabilityService,
  ],
})
export class CapabilityRuntimeModule {}
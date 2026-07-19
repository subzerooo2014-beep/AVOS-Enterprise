import { Module } from "@nestjs/common";
import { PlatformProductionFileStoreService } from "./platform-production-file-store.service";
import { PlatformRuntimeRegistryService } from "./platform-runtime-registry.service";
import { PlatformRuntimeContextService } from "./platform-runtime-context.service";
import { PlatformRuntimeConfigurationService } from "./platform-runtime-configuration.service";
import { PlatformRuntimeSessionService } from "./platform-runtime-session.service";
import { UnifiedPlatformRuntimeService } from "./unified-platform-runtime.service";
import { PlatformProductionMegaPack1StatusService } from "./platform-production-mega-pack-1-status.service";
import { PlatformProductionMegaPack1AssuranceService } from "./platform-production-mega-pack-1-assurance.service";
import { PlatformProductionMegaPack1Controller } from "./platform-production-mega-pack-1.controller";

@Module({
  controllers: [PlatformProductionMegaPack1Controller],
  providers: [
    PlatformProductionFileStoreService,
    PlatformRuntimeRegistryService,
    PlatformRuntimeContextService,
    PlatformRuntimeConfigurationService,
    PlatformRuntimeSessionService,
    UnifiedPlatformRuntimeService,
    PlatformProductionMegaPack1StatusService,
    PlatformProductionMegaPack1AssuranceService,
  ],
  exports: [
    PlatformRuntimeRegistryService,
    PlatformRuntimeContextService,
    PlatformRuntimeConfigurationService,
    PlatformRuntimeSessionService,
    UnifiedPlatformRuntimeService,
    PlatformProductionMegaPack1StatusService,
  ],
})
export class PlatformProductionMegaPack1Module {}
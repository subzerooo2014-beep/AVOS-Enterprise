import { Module } from "@nestjs/common";
import { PlatformControlPlaneModule } from "../platform-control-plane/platform-control-plane.module";
import { PlatformServiceLifecycleController } from "./platform-service-lifecycle.controller";
import { PlatformCommandHistoryService } from "./services/platform-command-history.service";
import { PlatformDiagnosticsService } from "./services/platform-diagnostics.service";
import { PlatformFailureService } from "./services/platform-failure.service";
import { PlatformHeartbeatService } from "./services/platform-heartbeat.service";
import { PlatformLifecycleIdService } from "./services/platform-lifecycle-id.service";
import { PlatformRuntimeRegistryService } from "./services/platform-runtime-registry.service";
import { PlatformServiceLifecycleService } from "./services/platform-service-lifecycle.service";

@Module({
  imports: [PlatformControlPlaneModule],
  controllers: [PlatformServiceLifecycleController],
  providers: [
    PlatformLifecycleIdService,
    PlatformRuntimeRegistryService,
    PlatformCommandHistoryService,
    PlatformHeartbeatService,
    PlatformFailureService,
    PlatformDiagnosticsService,
    PlatformServiceLifecycleService
  ],
  exports: [
    PlatformRuntimeRegistryService,
    PlatformHeartbeatService,
    PlatformFailureService,
    PlatformDiagnosticsService,
    PlatformServiceLifecycleService
  ]
})
export class PlatformServiceLifecycleModule {}
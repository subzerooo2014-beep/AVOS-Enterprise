import { Module } from "@nestjs/common";
import { PlatformControlPlaneController } from "./platform-control-plane.controller";
import { PlatformAuditService } from "./services/platform-audit.service";
import { PlatformConfigurationService } from "./services/platform-configuration.service";
import { PlatformControlPlaneService } from "./services/platform-control-plane.service";
import { PlatformEnvironmentService } from "./services/platform-environment.service";
import { PlatformIdService } from "./services/platform-id.service";
import { PlatformRegistryService } from "./services/platform-registry.service";

@Module({
  controllers: [PlatformControlPlaneController],
  providers: [
    PlatformIdService,
    PlatformAuditService,
    PlatformEnvironmentService,
    PlatformRegistryService,
    PlatformConfigurationService,
    PlatformControlPlaneService
  ],
  exports: [
    PlatformAuditService,
    PlatformEnvironmentService,
    PlatformRegistryService,
    PlatformConfigurationService,
    PlatformControlPlaneService
  ]
})
export class PlatformControlPlaneModule {}

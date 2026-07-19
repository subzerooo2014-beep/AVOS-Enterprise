import { Module } from "@nestjs/common";
import { FoundationProductionFileStoreService } from "./foundation-production-file-store.service";
import { FoundationIntegrationRegistryService } from "./foundation-integration-registry.service";
import { UnifiedControlPlaneService } from "./unified-control-plane.service";
import { UnifiedCertificationRegistryService } from "./unified-certification-registry.service";
import { FoundationProductionStatusService } from "./foundation-production-status.service";
import { FoundationProductionAssuranceService } from "./foundation-production-assurance.service";
import { FoundationProductionController } from "./foundation-production.controller";

@Module({
  controllers: [FoundationProductionController],
  providers: [
    FoundationProductionFileStoreService,
    FoundationIntegrationRegistryService,
    UnifiedControlPlaneService,
    UnifiedCertificationRegistryService,
    FoundationProductionStatusService,
    FoundationProductionAssuranceService,
  ],
  exports: [
    FoundationIntegrationRegistryService,
    UnifiedControlPlaneService,
    UnifiedCertificationRegistryService,
    FoundationProductionStatusService,
  ],
})
export class FoundationProductionIntegrationModule {}
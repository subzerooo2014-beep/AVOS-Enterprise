import { Module } from "@nestjs/common";
import { FoundationUltraPackBFileStoreService } from "./foundation-ultra-pack-b-file-store.service";
import { EnterpriseMetadataPlatformService } from "./enterprise-metadata-platform.service";
import { DataFoundationService } from "./data-foundation.service";
import { EnterpriseContractLayerService } from "./enterprise-contract-layer.service";
import { FoundationUltraPackBStatusService } from "./foundation-ultra-pack-b-status.service";
import { FoundationUltraPackBAssuranceService } from "./foundation-ultra-pack-b-assurance.service";
import { FoundationUltraPackBController } from "./foundation-ultra-pack-b.controller";

@Module({
  controllers: [FoundationUltraPackBController],
  providers: [
    FoundationUltraPackBFileStoreService,
    EnterpriseMetadataPlatformService,
    DataFoundationService,
    EnterpriseContractLayerService,
    FoundationUltraPackBStatusService,
    FoundationUltraPackBAssuranceService,
  ],
  exports: [
    EnterpriseMetadataPlatformService,
    DataFoundationService,
    EnterpriseContractLayerService,
    FoundationUltraPackBStatusService,
  ],
})
export class FoundationUltraPackBModule {}
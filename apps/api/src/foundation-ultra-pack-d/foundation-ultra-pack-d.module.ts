import { Module } from "@nestjs/common";
import { FoundationUltraPackDFileStoreService } from "./foundation-ultra-pack-d-file-store.service";
import { ArchitectureIntelligenceService } from "./architecture-intelligence.service";
import { RuntimeObservabilityService } from "./runtime-observability.service";
import { EvolutionControlService } from "./evolution-control.service";
import { FoundationUltraPackDStatusService } from "./foundation-ultra-pack-d-status.service";
import { FoundationUltraPackDAssuranceService } from "./foundation-ultra-pack-d-assurance.service";
import { FoundationUltraPackDController } from "./foundation-ultra-pack-d.controller";

@Module({
  controllers: [FoundationUltraPackDController],
  providers: [
    FoundationUltraPackDFileStoreService,
    ArchitectureIntelligenceService,
    RuntimeObservabilityService,
    EvolutionControlService,
    FoundationUltraPackDStatusService,
    FoundationUltraPackDAssuranceService,
  ],
  exports: [
    ArchitectureIntelligenceService,
    RuntimeObservabilityService,
    EvolutionControlService,
    FoundationUltraPackDStatusService,
  ],
})
export class FoundationUltraPackDModule {}
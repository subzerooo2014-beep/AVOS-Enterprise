import { Module } from "@nestjs/common";
import { FoundationUltraPackEFileStoreService } from "./foundation-ultra-pack-e-file-store.service";
import { ValueIntelligenceService } from "./value-intelligence.service";
import { TrustIntelligenceService } from "./trust-intelligence.service";
import { DecisionGovernanceService } from "./decision-governance.service";
import { FoundationConsolidationService } from "./foundation-consolidation.service";
import { FoundationUltraPackEStatusService } from "./foundation-ultra-pack-e-status.service";
import { FoundationUltraPackEAssuranceService } from "./foundation-ultra-pack-e-assurance.service";
import { FoundationUltraPackEController } from "./foundation-ultra-pack-e.controller";

@Module({
  controllers: [FoundationUltraPackEController],
  providers: [
    FoundationUltraPackEFileStoreService,
    ValueIntelligenceService,
    TrustIntelligenceService,
    DecisionGovernanceService,
    FoundationConsolidationService,
    FoundationUltraPackEStatusService,
    FoundationUltraPackEAssuranceService,
  ],
  exports: [
    ValueIntelligenceService,
    TrustIntelligenceService,
    DecisionGovernanceService,
    FoundationConsolidationService,
    FoundationUltraPackEStatusService,
  ],
})
export class FoundationUltraPackEModule {}
import { Module } from "@nestjs/common";
import { FoundationUltraPackCFileStoreService } from "./foundation-ultra-pack-c-file-store.service";
import { GovernancePolicyRuntimeService } from "./governance-policy-runtime.service";
import { SecurityFoundationService } from "./security-foundation.service";
import { PrivacyComplianceRuntimeService } from "./privacy-compliance-runtime.service";
import { FoundationUltraPackCStatusService } from "./foundation-ultra-pack-c-status.service";
import { FoundationUltraPackCAssuranceService } from "./foundation-ultra-pack-c-assurance.service";
import { FoundationUltraPackCController } from "./foundation-ultra-pack-c.controller";

@Module({
  controllers: [FoundationUltraPackCController],
  providers: [
    FoundationUltraPackCFileStoreService,
    GovernancePolicyRuntimeService,
    SecurityFoundationService,
    PrivacyComplianceRuntimeService,
    FoundationUltraPackCStatusService,
    FoundationUltraPackCAssuranceService,
  ],
  exports: [
    GovernancePolicyRuntimeService,
    SecurityFoundationService,
    PrivacyComplianceRuntimeService,
    FoundationUltraPackCStatusService,
  ],
})
export class FoundationUltraPackCModule {}
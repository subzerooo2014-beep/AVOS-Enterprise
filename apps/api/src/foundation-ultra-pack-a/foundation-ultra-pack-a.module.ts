import { Module } from "@nestjs/common";
import { FoundationFileStoreService } from "./foundation-file-store.service";
import { DigitalConstitutionService } from "./digital-constitution.service";
import { EnterpriseLanguageService } from "./enterprise-language.service";
import { SemanticEngineService } from "./semantic-engine.service";
import { DigitalIdentityFoundationService } from "./digital-identity-foundation.service";
import { LivingBlueprintService } from "./living-blueprint.service";
import { FoundationUltraPackAStatusService } from "./foundation-ultra-pack-a-status.service";
import { FoundationUltraPackAAssuranceService } from "./foundation-ultra-pack-a-assurance.service";
import { FoundationUltraPackAController } from "./foundation-ultra-pack-a.controller";

@Module({
  controllers: [FoundationUltraPackAController],
  providers: [
    FoundationFileStoreService,
    DigitalConstitutionService,
    EnterpriseLanguageService,
    SemanticEngineService,
    DigitalIdentityFoundationService,
    LivingBlueprintService,
    FoundationUltraPackAStatusService,
    FoundationUltraPackAAssuranceService,
  ],
  exports: [
    DigitalConstitutionService,
    EnterpriseLanguageService,
    SemanticEngineService,
    DigitalIdentityFoundationService,
    LivingBlueprintService,
    FoundationUltraPackAStatusService,
  ],
})
export class FoundationUltraPackAModule {}
import { Module } from "@nestjs/common";
import { EnterpriseFoundationsController } from "./enterprise-foundations.controller";
import { EnterpriseFoundationsService } from "./enterprise-foundations.service";
import { DataAiFoundationService } from "./data-ai-foundation.service";
import { RuntimeIntegrationFoundationService } from "./runtime-integration-foundation.service";
import { IdentityMultitenancyFoundationService } from "./identity-multitenancy-foundation.service";
import { DeveloperApiPluginFoundationService } from "./developer-api-plugin-foundation.service";
import { LegalGlobalFoundationService } from "./legal-global-foundation.service";
import { SecurityObservabilityExperienceFoundationService } from "./security-observability-experience-foundation.service";

@Module({
  controllers: [EnterpriseFoundationsController],
  providers: [
    EnterpriseFoundationsService,
    DataAiFoundationService,
    RuntimeIntegrationFoundationService,
    IdentityMultitenancyFoundationService,
    DeveloperApiPluginFoundationService,
    LegalGlobalFoundationService,
    SecurityObservabilityExperienceFoundationService,
  ],
  exports: [
    EnterpriseFoundationsService,
    DataAiFoundationService,
    RuntimeIntegrationFoundationService,
    IdentityMultitenancyFoundationService,
    DeveloperApiPluginFoundationService,
    LegalGlobalFoundationService,
    SecurityObservabilityExperienceFoundationService,
  ],
})
export class EnterpriseFoundationsModule {}
import { Module } from '@nestjs/common';
import { FoundationFinalCompletionController } from './foundation-final-completion.controller';
import { FoundationFinalCompletionService } from './foundation-final-completion.service';
import { GlobalInteroperabilityService } from './interoperability/global-interoperability.service';
import { GlobalLocalizationService } from './localization/global-localization.service';
import { ResponsibleAiService } from './responsible-ai/responsible-ai.service';
import { EnterpriseContinuityService } from './continuity/enterprise-continuity.service';
import { EnterpriseConfigurationService } from './configuration/enterprise-configuration.service';

@Module({
  controllers: [FoundationFinalCompletionController],
  providers: [
    FoundationFinalCompletionService,
    GlobalInteroperabilityService,
    GlobalLocalizationService,
    ResponsibleAiService,
    EnterpriseContinuityService,
    EnterpriseConfigurationService,
  ],
  exports: [
    FoundationFinalCompletionService,
    GlobalInteroperabilityService,
    GlobalLocalizationService,
    ResponsibleAiService,
    EnterpriseContinuityService,
    EnterpriseConfigurationService,
  ],
})
export class FoundationFinalCompletionModule {}

import { Module } from "@nestjs/common";
import { GlobalLanguagePlatformController } from "./global-language-platform.controller";
import { GlobalLanguagePlatformService } from "./global-language-platform.service";
import { LanguagePackService } from "./services/language-pack.service";
import { LanguageRegistryService } from "./services/language-registry.service";
import { LanguageVersionService } from "./services/language-version.service";
import { DynamicLanguageLoadingService } from "./services/dynamic-language-loading.service";
import { TextDirectionService } from "./services/text-direction.service";
import { TranslationMemoryService } from "./services/translation-memory.service";
import { TranslationMemorySearchService } from "./services/translation-memory-search.service";
import { TerminologyService } from "./services/terminology.service";
import { DomainDictionaryService } from "./services/domain-dictionary.service";
import { LocalizationKeyService } from "./services/localization-key.service";
import { TranslationService } from "./services/translation.service";
import { LanguageDetectionService } from "./services/language-detection.service";
import { TranslationQualityService } from "./services/translation-quality.service";
import { QualityRuleService } from "./services/quality-rule.service";
import { FallbackLanguageService } from "./services/fallback-language.service";
import { RegionProfileService } from "./services/region-profile.service";
import { NumberFormattingService } from "./services/number-formatting.service";
import { CurrencyFormattingService } from "./services/currency-formatting.service";
import { DateTimeFormattingService } from "./services/date-time-formatting.service";
import { LanguageAuditService } from "./services/language-audit.service";
import { LanguagePlatformDashboardService } from "./services/language-platform-dashboard.service";
import { UniversalLanguageRuntime } from "./runtime/universal-language.runtime";
import { LanguagePackRuntime } from "./runtime/language-pack.runtime";
import { DynamicLoadingRuntime } from "./runtime/dynamic-loading.runtime";
import { RtlLtrRuntime } from "./runtime/rtl-ltr.runtime";
import { TranslationMemoryRuntime } from "./runtime/translation-memory.runtime";
import { TerminologyRuntime } from "./runtime/terminology.runtime";
import { TranslationQualityRuntime } from "./runtime/translation-quality.runtime";
import { FallbackRuntime } from "./runtime/fallback.runtime";

@Module({
  controllers:[GlobalLanguagePlatformController],
  providers:[
    GlobalLanguagePlatformService,
    LanguagePackService,LanguageRegistryService,LanguageVersionService,DynamicLanguageLoadingService,
    TextDirectionService,TranslationMemoryService,TranslationMemorySearchService,TerminologyService,
    DomainDictionaryService,LocalizationKeyService,TranslationService,LanguageDetectionService,
    TranslationQualityService,QualityRuleService,FallbackLanguageService,RegionProfileService,
    NumberFormattingService,CurrencyFormattingService,DateTimeFormattingService,LanguageAuditService,
    LanguagePlatformDashboardService,
    UniversalLanguageRuntime,LanguagePackRuntime,DynamicLoadingRuntime,RtlLtrRuntime,
    TranslationMemoryRuntime,TerminologyRuntime,TranslationQualityRuntime,FallbackRuntime
  ],
  exports:[GlobalLanguagePlatformService],
})
export class GlobalLanguagePlatformModule {}

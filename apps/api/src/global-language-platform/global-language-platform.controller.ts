import { Body, Controller, Get, Post } from "@nestjs/common";
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
import { LanguagePlatformDashboardService } from "./services/language-platform-dashboard.service";

@Controller("global-language-platform")
export class GlobalLanguagePlatformController {
  constructor(
    private readonly os: GlobalLanguagePlatformService,
    private readonly packs: LanguagePackService,
    private readonly registry: LanguageRegistryService,
    private readonly versions: LanguageVersionService,
    private readonly loader: DynamicLanguageLoadingService,
    private readonly directions: TextDirectionService,
    private readonly memory: TranslationMemoryService,
    private readonly memorySearch: TranslationMemorySearchService,
    private readonly terminology: TerminologyService,
    private readonly dictionaries: DomainDictionaryService,
    private readonly localization: LocalizationKeyService,
    private readonly translation: TranslationService,
    private readonly detection: LanguageDetectionService,
    private readonly quality: TranslationQualityService,
    private readonly qualityRules: QualityRuleService,
    private readonly fallback: FallbackLanguageService,
    private readonly regions: RegionProfileService,
    private readonly numbers: NumberFormattingService,
    private readonly currencies: CurrencyFormattingService,
    private readonly dateTime: DateTimeFormattingService,
    private readonly dashboard: LanguagePlatformDashboardService,
  ) {}

  @Get("health") health(){ return this.os.health(); }
  @Post("language-packs") createLanguagePack(@Body() body:any){ return {success:true,languagePack:this.packs.create(body)}; }
  @Post("language-registry") registerLanguage(@Body() body:any){ return {success:true,language:this.registry.create(body)}; }
  @Post("language-versions") languageVersion(@Body() body:any){ return {success:true,version:this.versions.create(body)}; }
  @Post("load-language-pack") loadLanguagePack(@Body() body:any){ return {success:true,result:this.loader.create(body)}; }
  @Post("text-direction") textDirection(@Body() body:any){ return {success:true,result:this.directions.create(body)}; }
  @Post("translation-memory") translationMemory(@Body() body:any){ return {success:true,memory:this.memory.create(body)}; }
  @Post("translation-memory/search") searchMemory(@Body() body:any){ return {success:true,result:this.memorySearch.create(body)}; }
  @Post("terminology") terminologyEntry(@Body() body:any){ return {success:true,terminology:this.terminology.create(body)}; }
  @Post("dictionaries") dictionary(@Body() body:any){ return {success:true,dictionary:this.dictionaries.create(body)}; }
  @Post("localization-keys") localizationKey(@Body() body:any){ return {success:true,key:this.localization.create(body)}; }
  @Post("translate") translate(@Body() body:any){ return {success:true,translation:this.translation.create(body)}; }
  @Post("detect-language") detectLanguage(@Body() body:any){ return {success:true,detection:this.detection.create(body)}; }
  @Post("quality/check") qualityCheck(@Body() body:any){ return {success:true,quality:this.quality.create(body)}; }
  @Post("quality/rules") qualityRule(@Body() body:any){ return {success:true,rule:this.qualityRules.create(body)}; }
  @Post("fallback-rules") fallbackRule(@Body() body:any){ return {success:true,fallback:this.fallback.create(body)}; }
  @Post("region-profiles") regionProfile(@Body() body:any){ return {success:true,region:this.regions.create(body)}; }
  @Post("format/number") formatNumber(@Body() body:any){ return {success:true,result:this.numbers.create(body)}; }
  @Post("format/currency") formatCurrency(@Body() body:any){ return {success:true,result:this.currencies.create(body)}; }
  @Post("format/date-time") formatDateTime(@Body() body:any){ return {success:true,result:this.dateTime.create(body)}; }
  @Get("operations/dashboard") operations(){ return {success:true,dashboard:this.dashboard.summary()}; }
}

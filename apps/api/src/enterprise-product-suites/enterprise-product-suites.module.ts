import { Module } from "@nestjs/common";
import { EnterpriseProductSuitesController } from "./enterprise-product-suites.controller";
import { EnterpriseProductSuitesService } from "./enterprise-product-suites.service";
import { EnterpriseCrmSuiteService } from "./enterprise-crm-suite.service";
import { EnterpriseErpSuiteService } from "./enterprise-erp-suite.service";
import { MarketplaceSuiteService } from "./marketplace-suite.service";
import { AiEnterpriseSuiteService } from "./ai-enterprise-suite.service";
import { IndustryPacksSuiteService } from "./industry-packs-suite.service";
import { GlobalSaasSuiteService } from "./global-saas-suite.service";

@Module({
  controllers: [EnterpriseProductSuitesController],
  providers: [
    EnterpriseProductSuitesService,
    EnterpriseCrmSuiteService,
    EnterpriseErpSuiteService,
    MarketplaceSuiteService,
    AiEnterpriseSuiteService,
    IndustryPacksSuiteService,
    GlobalSaasSuiteService,
  ],
  exports: [
    EnterpriseProductSuitesService,
    EnterpriseCrmSuiteService,
    EnterpriseErpSuiteService,
    MarketplaceSuiteService,
    AiEnterpriseSuiteService,
    IndustryPacksSuiteService,
    GlobalSaasSuiteService,
  ],
})
export class EnterpriseProductSuitesModule {}
import { Injectable } from "@nestjs/common";
import { ENTERPRISE_PRODUCT_CAPABILITIES } from "./enterprise-product-suites.registry";
import { ProductSuiteKey } from "./enterprise-product-suites.types";
import { EnterpriseCrmSuiteService } from "./enterprise-crm-suite.service";
import { EnterpriseErpSuiteService } from "./enterprise-erp-suite.service";
import { MarketplaceSuiteService } from "./marketplace-suite.service";
import { AiEnterpriseSuiteService } from "./ai-enterprise-suite.service";
import { IndustryPacksSuiteService } from "./industry-packs-suite.service";
import { GlobalSaasSuiteService } from "./global-saas-suite.service";

@Injectable()
export class EnterpriseProductSuitesService {
  constructor(
    private readonly crm: EnterpriseCrmSuiteService,
    private readonly erp: EnterpriseErpSuiteService,
    private readonly marketplace: MarketplaceSuiteService,
    private readonly ai: AiEnterpriseSuiteService,
    private readonly industryPacks: IndustryPacksSuiteService,
    private readonly saas: GlobalSaasSuiteService,
  ) {}

  capabilities(suite?: ProductSuiteKey) {
    return ENTERPRISE_PRODUCT_CAPABILITIES
      .filter((capability) => !suite || capability.suite === suite)
      .map((capability) => ({ ...capability }));
  }

  dashboard() {
    const count = (suite: ProductSuiteKey) =>
      ENTERPRISE_PRODUCT_CAPABILITIES.filter(
        (capability) => capability.suite === suite,
      ).length;

    return {
      system: "AVOS Six Enterprise Product Suites",
      suites: 6,
      capabilities: ENTERPRISE_PRODUCT_CAPABILITIES.length,
      crmCapabilities: count("CRM"),
      erpCapabilities: count("ERP"),
      marketplaceCapabilities: count("MARKETPLACE"),
      aiEnterpriseCapabilities: count("AI_ENTERPRISE"),
      industryPackCapabilities: count("INDUSTRY_PACKS"),
      globalSaasCapabilities: count("GLOBAL_SAAS"),
      crm: this.crm.dashboard(),
      erp: this.erp.dashboard(),
      marketplace: this.marketplace.dashboard(),
      aiEnterprise: this.ai.dashboard(),
      industryPacks: this.industryPacks.dashboard(),
      globalSaas: this.saas.dashboard(),
      generatedAt: new Date().toISOString(),
    };
  }
}
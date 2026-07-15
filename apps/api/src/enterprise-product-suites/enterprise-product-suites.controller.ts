import { Body, Controller, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { EnterpriseProductSuitesService } from "./enterprise-product-suites.service";
import { EnterpriseCrmSuiteService } from "./enterprise-crm-suite.service";
import { EnterpriseErpSuiteService } from "./enterprise-erp-suite.service";
import { MarketplaceSuiteService } from "./marketplace-suite.service";
import { AiEnterpriseSuiteService } from "./ai-enterprise-suite.service";
import { IndustryPacksSuiteService } from "./industry-packs-suite.service";
import { GlobalSaasSuiteService } from "./global-saas-suite.service";
import {
  AiEnterpriseTask,
  CrmCustomer360,
  ErpRecord,
  IndustryPackActivation,
  MarketplacePortalProfile,
  ProductSuiteKey,
  SaasTenant,
} from "./enterprise-product-suites.types";

@Controller("enterprise-product-suites")
export class EnterpriseProductSuitesController {
  constructor(
    private readonly products: EnterpriseProductSuitesService,
    private readonly crm: EnterpriseCrmSuiteService,
    private readonly erp: EnterpriseErpSuiteService,
    private readonly marketplace: MarketplaceSuiteService,
    private readonly ai: AiEnterpriseSuiteService,
    private readonly industryPacks: IndustryPacksSuiteService,
    private readonly saas: GlobalSaasSuiteService,
  ) {}

  @Get("capabilities")
  capabilities(@Query("suite") suite?: ProductSuiteKey) {
    return this.products.capabilities(suite);
  }

  @Post("crm/customers")
  upsertCrmCustomer(
    @Body()
    input: Omit<CrmCustomer360, "id" | "createdAt" | "updatedAt"> & { id?: string },
  ) {
    return this.crm.upsert(input);
  }

  @Patch("crm/customers/:id/loyalty")
  addLoyaltyPoints(
    @Param("id") id: string,
    @Body() body: { points: number },
  ) {
    return this.crm.addLoyaltyPoints(id, body.points);
  }

  @Post("erp/records")
  createErpRecord(
    @Body()
    input: Omit<ErpRecord, "id" | "status" | "createdAt" | "updatedAt">,
  ) {
    return this.erp.create(input);
  }

  @Patch("erp/records/:id/activate")
  activateErpRecord(@Param("id") id: string) {
    return this.erp.activate(id);
  }

  @Patch("erp/records/:id/complete")
  completeErpRecord(@Param("id") id: string) {
    return this.erp.complete(id);
  }

  @Post("marketplace/portals")
  createPortal(
    @Body()
    input: Omit<MarketplacePortalProfile, "id" | "createdAt" | "updatedAt">,
  ) {
    return this.marketplace.createPortal(input);
  }

  @Patch("marketplace/portals/:id/capabilities")
  updatePortalCapabilities(
    @Param("id") id: string,
    @Body() body: { capabilities: string[] },
  ) {
    return this.marketplace.updateCapabilities(id, body.capabilities);
  }

  @Post("ai/tasks")
  createAiTask(
    @Body()
    input: Omit<
      AiEnterpriseTask,
      "id" | "recommendations" | "confidence" | "status" | "createdAt" | "updatedAt"
    >,
  ) {
    return this.ai.createTask(input);
  }

  @Patch("ai/tasks/:id/complete")
  completeAiTask(
    @Param("id") id: string,
    @Body()
    body: {
      recommendations: string[];
      confidence: number;
    },
  ) {
    return this.ai.completeTask(
      id,
      body.recommendations,
      body.confidence,
    );
  }

  @Post("industry-packs")
  activateIndustryPack(
    @Body()
    input: Omit<IndustryPackActivation, "id" | "createdAt" | "updatedAt">,
  ) {
    return this.industryPacks.activate(input);
  }

  @Patch("industry-packs/:id/capabilities")
  updateIndustryPackCapabilities(
    @Param("id") id: string,
    @Body() body: { enabledCapabilities: string[] },
  ) {
    return this.industryPacks.updateCapabilities(
      id,
      body.enabledCapabilities,
    );
  }

  @Post("saas/tenants")
  createSaasTenant(
    @Body()
    input: Omit<SaasTenant, "id" | "status" | "createdAt" | "updatedAt">,
  ) {
    return this.saas.createTenant(input);
  }

  @Patch("saas/tenants/:id/activate")
  activateSaasTenant(@Param("id") id: string) {
    return this.saas.activateTenant(id);
  }

  @Patch("saas/tenants/:id/plan")
  changeSaasPlan(
    @Param("id") id: string,
    @Body()
    body: {
      plan: SaasTenant["plan"];
      subscriptionAmount: number;
    },
  ) {
    return this.saas.changePlan(
      id,
      body.plan,
      body.subscriptionAmount,
    );
  }

  @Get("dashboard")
  dashboard() {
    return this.products.dashboard();
  }
}
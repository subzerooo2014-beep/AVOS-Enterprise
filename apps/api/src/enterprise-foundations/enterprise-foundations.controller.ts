import { Body, Controller, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { EnterpriseFoundationsService } from "./enterprise-foundations.service";
import { DataAiFoundationService } from "./data-ai-foundation.service";
import { RuntimeIntegrationFoundationService } from "./runtime-integration-foundation.service";
import { IdentityMultitenancyFoundationService } from "./identity-multitenancy-foundation.service";
import { DeveloperApiPluginFoundationService } from "./developer-api-plugin-foundation.service";
import { LegalGlobalFoundationService } from "./legal-global-foundation.service";
import { SecurityObservabilityExperienceFoundationService } from "./security-observability-experience-foundation.service";
import {
  DataAssetRegistration,
  DeveloperAsset,
  FoundationDomain,
  FoundationRegistration,
  IdentityContext,
  LegalOperationPolicy,
  RuntimeJob,
  SecurityObservation,
} from "./enterprise-foundations.types";

@Controller("enterprise-foundations")
export class EnterpriseFoundationsController {
  constructor(
    private readonly foundations: EnterpriseFoundationsService,
    private readonly dataAi: DataAiFoundationService,
    private readonly runtime: RuntimeIntegrationFoundationService,
    private readonly identity: IdentityMultitenancyFoundationService,
    private readonly developer: DeveloperApiPluginFoundationService,
    private readonly legalGlobal: LegalGlobalFoundationService,
    private readonly securityExperience:
      SecurityObservabilityExperienceFoundationService,
  ) {}

  @Get("capabilities")
  capabilities(@Query("domain") domain?: FoundationDomain) {
    return this.foundations.capabilities(domain);
  }

  @Post("registrations")
  register(
    @Body()
    input: Omit<FoundationRegistration, "id" | "createdAt" | "updatedAt">,
  ) {
    return this.foundations.register(input);
  }

  @Post("data-ai/assets")
  registerDataAsset(
    @Body()
    input: Omit<DataAssetRegistration, "id" | "createdAt" | "updatedAt">,
  ) {
    return this.dataAi.registerAsset(input);
  }

  @Patch("data-ai/assets/:id/quality")
  updateDataQuality(
    @Param("id") id: string,
    @Body() body: { qualityScore: number },
  ) {
    return this.dataAi.updateQuality(id, body.qualityScore);
  }

  @Post("runtime/jobs")
  enqueueRuntimeJob(
    @Body()
    input: Omit<
      RuntimeJob,
      "id" | "status" | "attempts" | "createdAt" | "updatedAt"
    >,
  ) {
    return this.runtime.enqueue(input);
  }

  @Patch("runtime/jobs/:id/status")
  updateRuntimeJob(
    @Param("id") id: string,
    @Body() body: { status: RuntimeJob["status"] },
  ) {
    return this.runtime.updateStatus(id, body.status);
  }

  @Post("identity/contexts")
  registerIdentity(
    @Body()
    input: Omit<IdentityContext, "id" | "createdAt" | "updatedAt">,
  ) {
    return this.identity.register(input);
  }

  @Post("identity/authorize")
  authorize(
    @Body()
    body: {
      identityId: string;
      tenantId: string;
      requiredRole?: string;
      requiredAttributes?: Record<string, string>;
    },
  ) {
    return this.identity.authorize(
      body.identityId,
      body.tenantId,
      body.requiredRole,
      body.requiredAttributes,
    );
  }

  @Post("developer/assets")
  registerDeveloperAsset(
    @Body()
    input: Omit<DeveloperAsset, "id" | "status" | "createdAt" | "updatedAt">,
  ) {
    return this.developer.register(input);
  }

  @Patch("developer/assets/:id/publish")
  publishDeveloperAsset(@Param("id") id: string) {
    return this.developer.publish(id);
  }

  @Post("legal/policies")
  registerLegalPolicy(
    @Body()
    input: Omit<LegalOperationPolicy, "id" | "createdAt" | "updatedAt">,
  ) {
    return this.legalGlobal.registerPolicy(input);
  }

  @Post("legal/evaluate")
  evaluateLegalPolicy(
    @Body()
    body: {
      jurisdiction: string;
      policyKey: string;
      at: string;
    },
  ) {
    return this.legalGlobal.evaluate(
      body.jurisdiction,
      body.policyKey,
      body.at,
    );
  }

  @Post("security/observations")
  recordObservation(
    @Body()
    input: Omit<
      SecurityObservation,
      "id" | "resolved" | "createdAt" | "resolvedAt"
    >,
  ) {
    return this.securityExperience.record(input);
  }

  @Patch("security/observations/:id/resolve")
  resolveObservation(@Param("id") id: string) {
    return this.securityExperience.resolve(id);
  }

  @Get("dashboard")
  dashboard() {
    return this.foundations.dashboard();
  }
}
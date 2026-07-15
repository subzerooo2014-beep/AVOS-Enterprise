import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { ENTERPRISE_FOUNDATION_CAPABILITIES } from "./enterprise-foundations.registry";
import {
  FoundationDomain,
  FoundationRegistration,
} from "./enterprise-foundations.types";
import { DataAiFoundationService } from "./data-ai-foundation.service";
import { RuntimeIntegrationFoundationService } from "./runtime-integration-foundation.service";
import { IdentityMultitenancyFoundationService } from "./identity-multitenancy-foundation.service";
import { DeveloperApiPluginFoundationService } from "./developer-api-plugin-foundation.service";
import { LegalGlobalFoundationService } from "./legal-global-foundation.service";
import { SecurityObservabilityExperienceFoundationService } from "./security-observability-experience-foundation.service";

@Injectable()
export class EnterpriseFoundationsService {
  private readonly registrations =
    new Map<string, FoundationRegistration>();

  constructor(
    private readonly dataAi: DataAiFoundationService,
    private readonly runtime: RuntimeIntegrationFoundationService,
    private readonly identity: IdentityMultitenancyFoundationService,
    private readonly developer: DeveloperApiPluginFoundationService,
    private readonly legalGlobal: LegalGlobalFoundationService,
    private readonly securityExperience:
      SecurityObservabilityExperienceFoundationService,
  ) {}

  capabilities(domain?: FoundationDomain) {
    return ENTERPRISE_FOUNDATION_CAPABILITIES
      .filter((capability) => !domain || capability.domain === domain)
      .map((capability) => ({ ...capability }));
  }

  register(
    input: Omit<FoundationRegistration, "id" | "createdAt" | "updatedAt">,
  ): FoundationRegistration {
    const capability = ENTERPRISE_FOUNDATION_CAPABILITIES.find(
      (item) =>
        item.key === input.capabilityKey &&
        item.domain === input.domain &&
        item.active,
    );

    if (!capability) {
      throw new Error(
        `Active capability not found: ${input.domain}/${input.capabilityKey}`,
      );
    }

    const now = new Date().toISOString();

    const registration: FoundationRegistration = {
      ...input,
      id: randomUUID(),
      configuration: { ...input.configuration },
      createdAt: now,
      updatedAt: now,
    };

    this.registrations.set(registration.id, registration);

    return {
      ...registration,
      configuration: { ...registration.configuration },
    };
  }

  dashboard() {
    const capabilities = ENTERPRISE_FOUNDATION_CAPABILITIES;

    const count = (domain: FoundationDomain) =>
      capabilities.filter((item) => item.domain === domain).length;

    return {
      system: "AVOS Six Critical Enterprise Foundations",
      foundations: 6,
      capabilities: capabilities.length,
      registrations: this.registrations.size,
      dataAiCapabilities: count("DATA_AI"),
      runtimeIntegrationCapabilities: count("RUNTIME_INTEGRATION"),
      identityMultiTenancyCapabilities: count(
        "IDENTITY_MULTI_TENANCY",
      ),
      developerApiPluginCapabilities: count(
        "DEVELOPER_API_PLUGIN",
      ),
      legalGlobalCapabilities: count("LEGAL_GLOBAL_OPERATIONS"),
      securityObservabilityExperienceCapabilities: count(
        "SECURITY_OBSERVABILITY_EXPERIENCE",
      ),
      dataAi: this.dataAi.dashboard(),
      runtime: this.runtime.dashboard(),
      identity: this.identity.dashboard(),
      developer: this.developer.dashboard(),
      legalGlobal: this.legalGlobal.dashboard(),
      securityExperience: this.securityExperience.dashboard(),
      generatedAt: new Date().toISOString(),
    };
  }
}
import { Injectable } from "@nestjs/common";
import { IntegrationCatalogService } from "./integration-catalog.service";
import { IntegrationProviderRegistryService } from "./integration-provider-registry.service";

@Injectable()
export class IntegrationGovernanceService {
  constructor(
    private readonly catalog: IntegrationCatalogService,
    private readonly providers: IntegrationProviderRegistryService,
  ) {}

  validate() {
    const components = this.catalog.list();
    const providerList = this.providers.list();
    const violations: {
      code: string;
      component: string;
      message: string;
    }[] = [];

    for (const component of components) {
      if (!component.version) {
        violations.push({
          code: "INTEGRATION_VERSION_MISSING",
          component: component.id,
          message: "Integration component version is missing.",
        });
      }

      if (component.type === "UNKNOWN") {
        violations.push({
          code: "INTEGRATION_TYPE_UNKNOWN",
          component: component.id,
          message: "Integration component type could not be classified.",
        });
      }
    }

    for (const provider of providerList) {
      if (provider.health === "DEGRADED") {
        violations.push({
          code: "INTEGRATION_PROVIDER_DEGRADED",
          component: provider.id,
          message: "Integration provider is degraded.",
        });
      }
    }

    return {
      compliant: violations.length === 0,
      score: Math.max(0, 100 - violations.length * 5),
      checkedAt: new Date().toISOString(),
      violations,
    };
  }
}

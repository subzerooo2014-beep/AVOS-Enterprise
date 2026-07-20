import { Injectable } from "@nestjs/common";
import { StudioSectionBaseService } from "../foundation/studio-section-base.service";
import { StudioDomainService } from "../foundation/studio-domain.service";
import { AdaptiveGrowthStudioRegistryService } from "../foundation/adaptive-growth-studio-registry.service";

@Injectable()
export class ConfigurationFeatureManagementService extends StudioSectionBaseService {
  readonly definition = {
    id: "configuration-feature-management",
    name: "Configuration & Feature Management",
    category: "section" as const,
    route: "/avos/products/adaptive-growth-studio/configuration-feature-management",
    enabled: true,
    requiresHumanApproval: true,
    permissions: ["ags:configuration-feature-management:read", "ags:configuration-feature-management:write"],
    capabilities: ["configuration-feature-management:read", "configuration-feature-management:create", "configuration-feature-management:manage"],
  };

  constructor(
    domain: StudioDomainService,
    registry: AdaptiveGrowthStudioRegistryService,
  ) {
    super(domain, registry);
  }
}
import { Injectable } from "@nestjs/common";
import { StudioSectionBaseService } from "../foundation/studio-section-base.service";
import { StudioDomainService } from "../foundation/studio-domain.service";
import { AdaptiveGrowthStudioRegistryService } from "../foundation/adaptive-growth-studio-registry.service";

@Injectable()
export class FeatureFlagManagerService extends StudioSectionBaseService {
  readonly definition = {
    id: "feature-flag-manager",
    name: "Feature Flag Manager",
    category: "shared" as const,
    route: "/avos/products/adaptive-growth-studio/feature-flag-manager",
    enabled: true,
    requiresHumanApproval: true,
    permissions: ["ags:feature-flag-manager:read", "ags:feature-flag-manager:write"],
    capabilities: ["feature-flag-manager:read", "feature-flag-manager:create", "feature-flag-manager:manage"],
  };

  constructor(
    domain: StudioDomainService,
    registry: AdaptiveGrowthStudioRegistryService,
  ) {
    super(domain, registry);
  }
}
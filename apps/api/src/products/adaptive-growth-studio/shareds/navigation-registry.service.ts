import { Injectable } from "@nestjs/common";
import { StudioSectionBaseService } from "../foundation/studio-section-base.service";
import { StudioDomainService } from "../foundation/studio-domain.service";
import { AdaptiveGrowthStudioRegistryService } from "../foundation/adaptive-growth-studio-registry.service";

@Injectable()
export class NavigationRegistryService extends StudioSectionBaseService {
  readonly definition = {
    id: "navigation-registry",
    name: "Navigation Registry",
    category: "shared" as const,
    route: "/avos/products/adaptive-growth-studio/navigation-registry",
    enabled: true,
    requiresHumanApproval: false,
    permissions: ["ags:navigation-registry:read", "ags:navigation-registry:write"],
    capabilities: ["navigation-registry:read", "navigation-registry:create", "navigation-registry:manage"],
  };

  constructor(
    domain: StudioDomainService,
    registry: AdaptiveGrowthStudioRegistryService,
  ) {
    super(domain, registry);
  }
}
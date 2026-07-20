import { Injectable } from "@nestjs/common";
import { StudioSectionBaseService } from "../foundation/studio-section-base.service";
import { StudioDomainService } from "../foundation/studio-domain.service";
import { AdaptiveGrowthStudioRegistryService } from "../foundation/adaptive-growth-studio-registry.service";

@Injectable()
export class OpportunityCenterService extends StudioSectionBaseService {
  readonly definition = {
    id: "opportunity-center",
    name: "Opportunity Center",
    category: "section" as const,
    route: "/avos/products/adaptive-growth-studio/opportunity-center",
    enabled: true,
    requiresHumanApproval: false,
    permissions: ["ags:opportunity-center:read", "ags:opportunity-center:write"],
    capabilities: ["opportunity-center:read", "opportunity-center:create", "opportunity-center:manage"],
  };

  constructor(
    domain: StudioDomainService,
    registry: AdaptiveGrowthStudioRegistryService,
  ) {
    super(domain, registry);
  }
}
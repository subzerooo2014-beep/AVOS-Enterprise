import { Injectable } from "@nestjs/common";
import { StudioSectionBaseService } from "../foundation/studio-section-base.service";
import { StudioDomainService } from "../foundation/studio-domain.service";
import { AdaptiveGrowthStudioRegistryService } from "../foundation/adaptive-growth-studio-registry.service";

@Injectable()
export class RecommendationCenterService extends StudioSectionBaseService {
  readonly definition = {
    id: "recommendation-center",
    name: "Recommendation Center",
    category: "section" as const,
    route: "/avos/products/adaptive-growth-studio/recommendation-center",
    enabled: true,
    requiresHumanApproval: false,
    permissions: ["ags:recommendation-center:read", "ags:recommendation-center:write"],
    capabilities: ["recommendation-center:read", "recommendation-center:create", "recommendation-center:manage"],
  };

  constructor(
    domain: StudioDomainService,
    registry: AdaptiveGrowthStudioRegistryService,
  ) {
    super(domain, registry);
  }
}
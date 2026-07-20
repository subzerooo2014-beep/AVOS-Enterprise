import { Injectable } from "@nestjs/common";
import { StudioSectionBaseService } from "../foundation/studio-section-base.service";
import { StudioDomainService } from "../foundation/studio-domain.service";
import { AdaptiveGrowthStudioRegistryService } from "../foundation/adaptive-growth-studio-registry.service";

@Injectable()
export class PricingStudioService extends StudioSectionBaseService {
  readonly definition = {
    id: "pricing-studio",
    name: "Pricing Studio",
    category: "section" as const,
    route: "/avos/products/adaptive-growth-studio/pricing-studio",
    enabled: true,
    requiresHumanApproval: true,
    permissions: ["ags:pricing-studio:read", "ags:pricing-studio:write"],
    capabilities: ["pricing-studio:read", "pricing-studio:create", "pricing-studio:manage"],
  };

  constructor(
    domain: StudioDomainService,
    registry: AdaptiveGrowthStudioRegistryService,
  ) {
    super(domain, registry);
  }
}
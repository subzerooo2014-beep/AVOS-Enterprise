import { Injectable } from "@nestjs/common";
import { StudioSectionBaseService } from "../foundation/studio-section-base.service";
import { StudioDomainService } from "../foundation/studio-domain.service";
import { AdaptiveGrowthStudioRegistryService } from "../foundation/adaptive-growth-studio-registry.service";

@Injectable()
export class RevenueIntelligenceCenterService extends StudioSectionBaseService {
  readonly definition = {
    id: "revenue-intelligence-center",
    name: "Revenue Intelligence Center",
    category: "section" as const,
    route: "/avos/products/adaptive-growth-studio/revenue-intelligence-center",
    enabled: true,
    requiresHumanApproval: false,
    permissions: ["ags:revenue-intelligence-center:read", "ags:revenue-intelligence-center:write"],
    capabilities: ["revenue-intelligence-center:read", "revenue-intelligence-center:create", "revenue-intelligence-center:manage"],
  };

  constructor(
    domain: StudioDomainService,
    registry: AdaptiveGrowthStudioRegistryService,
  ) {
    super(domain, registry);
  }
}
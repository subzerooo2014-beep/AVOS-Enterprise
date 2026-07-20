import { Injectable } from "@nestjs/common";
import { StudioSectionBaseService } from "../foundation/studio-section-base.service";
import { StudioDomainService } from "../foundation/studio-domain.service";
import { AdaptiveGrowthStudioRegistryService } from "../foundation/adaptive-growth-studio-registry.service";

@Injectable()
export class MarketIntelligenceCenterService extends StudioSectionBaseService {
  readonly definition = {
    id: "market-intelligence-center",
    name: "Market Intelligence Center",
    category: "section" as const,
    route: "/avos/products/adaptive-growth-studio/market-intelligence-center",
    enabled: true,
    requiresHumanApproval: false,
    permissions: ["ags:market-intelligence-center:read", "ags:market-intelligence-center:write"],
    capabilities: ["market-intelligence-center:read", "market-intelligence-center:create", "market-intelligence-center:manage"],
  };

  constructor(
    domain: StudioDomainService,
    registry: AdaptiveGrowthStudioRegistryService,
  ) {
    super(domain, registry);
  }
}
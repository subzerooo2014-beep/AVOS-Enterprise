import { Injectable } from "@nestjs/common";
import { StudioSectionBaseService } from "../foundation/studio-section-base.service";
import { StudioDomainService } from "../foundation/studio-domain.service";
import { AdaptiveGrowthStudioRegistryService } from "../foundation/adaptive-growth-studio-registry.service";

@Injectable()
export class PortfolioManagementCenterService extends StudioSectionBaseService {
  readonly definition = {
    id: "portfolio-management-center",
    name: "Portfolio Management Center",
    category: "section" as const,
    route: "/avos/products/adaptive-growth-studio/portfolio-management-center",
    enabled: true,
    requiresHumanApproval: false,
    permissions: ["ags:portfolio-management-center:read", "ags:portfolio-management-center:write"],
    capabilities: ["portfolio-management-center:read", "portfolio-management-center:create", "portfolio-management-center:manage"],
  };

  constructor(
    domain: StudioDomainService,
    registry: AdaptiveGrowthStudioRegistryService,
  ) {
    super(domain, registry);
  }
}
import { Injectable } from "@nestjs/common";
import { StudioSectionBaseService } from "../foundation/studio-section-base.service";
import { StudioDomainService } from "../foundation/studio-domain.service";
import { AdaptiveGrowthStudioRegistryService } from "../foundation/adaptive-growth-studio-registry.service";

@Injectable()
export class ExecutiveGrowthDashboardService extends StudioSectionBaseService {
  readonly definition = {
    id: "executive-growth-dashboard",
    name: "Executive Growth Dashboard",
    category: "section" as const,
    route: "/avos/products/adaptive-growth-studio/executive-growth-dashboard",
    enabled: true,
    requiresHumanApproval: false,
    permissions: ["ags:executive-growth-dashboard:read", "ags:executive-growth-dashboard:write"],
    capabilities: ["executive-growth-dashboard:read", "executive-growth-dashboard:create", "executive-growth-dashboard:manage"],
  };

  constructor(
    domain: StudioDomainService,
    registry: AdaptiveGrowthStudioRegistryService,
  ) {
    super(domain, registry);
  }
}
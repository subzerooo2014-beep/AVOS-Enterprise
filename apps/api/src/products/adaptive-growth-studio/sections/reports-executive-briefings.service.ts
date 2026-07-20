import { Injectable } from "@nestjs/common";
import { StudioSectionBaseService } from "../foundation/studio-section-base.service";
import { StudioDomainService } from "../foundation/studio-domain.service";
import { AdaptiveGrowthStudioRegistryService } from "../foundation/adaptive-growth-studio-registry.service";

@Injectable()
export class ReportsExecutiveBriefingsService extends StudioSectionBaseService {
  readonly definition = {
    id: "reports-executive-briefings",
    name: "Reports & Executive Briefings",
    category: "section" as const,
    route: "/avos/products/adaptive-growth-studio/reports-executive-briefings",
    enabled: true,
    requiresHumanApproval: false,
    permissions: ["ags:reports-executive-briefings:read", "ags:reports-executive-briefings:write"],
    capabilities: ["reports-executive-briefings:read", "reports-executive-briefings:create", "reports-executive-briefings:manage"],
  };

  constructor(
    domain: StudioDomainService,
    registry: AdaptiveGrowthStudioRegistryService,
  ) {
    super(domain, registry);
  }
}
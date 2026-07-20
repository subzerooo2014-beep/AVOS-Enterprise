import { Injectable } from "@nestjs/common";
import { StudioSectionBaseService } from "../foundation/studio-section-base.service";
import { StudioDomainService } from "../foundation/studio-domain.service";
import { AdaptiveGrowthStudioRegistryService } from "../foundation/adaptive-growth-studio-registry.service";

@Injectable()
export class CampaignManagementCenterService extends StudioSectionBaseService {
  readonly definition = {
    id: "campaign-management-center",
    name: "Campaign Management Center",
    category: "section" as const,
    route: "/avos/products/adaptive-growth-studio/campaign-management-center",
    enabled: true,
    requiresHumanApproval: true,
    permissions: ["ags:campaign-management-center:read", "ags:campaign-management-center:write"],
    capabilities: ["campaign-management-center:read", "campaign-management-center:create", "campaign-management-center:manage"],
  };

  constructor(
    domain: StudioDomainService,
    registry: AdaptiveGrowthStudioRegistryService,
  ) {
    super(domain, registry);
  }
}
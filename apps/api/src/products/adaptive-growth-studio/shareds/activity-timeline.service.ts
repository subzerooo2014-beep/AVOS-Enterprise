import { Injectable } from "@nestjs/common";
import { StudioSectionBaseService } from "../foundation/studio-section-base.service";
import { StudioDomainService } from "../foundation/studio-domain.service";
import { AdaptiveGrowthStudioRegistryService } from "../foundation/adaptive-growth-studio-registry.service";

@Injectable()
export class ActivityTimelineService extends StudioSectionBaseService {
  readonly definition = {
    id: "activity-timeline",
    name: "Activity Timeline",
    category: "shared" as const,
    route: "/avos/products/adaptive-growth-studio/activity-timeline",
    enabled: true,
    requiresHumanApproval: false,
    permissions: ["ags:activity-timeline:read", "ags:activity-timeline:write"],
    capabilities: ["activity-timeline:read", "activity-timeline:create", "activity-timeline:manage"],
  };

  constructor(
    domain: StudioDomainService,
    registry: AdaptiveGrowthStudioRegistryService,
  ) {
    super(domain, registry);
  }
}
import { Injectable } from "@nestjs/common";
import { StudioSectionBaseService } from "../foundation/studio-section-base.service";
import { StudioDomainService } from "../foundation/studio-domain.service";
import { AdaptiveGrowthStudioRegistryService } from "../foundation/adaptive-growth-studio-registry.service";

@Injectable()
export class TeamCollaborationCenterService extends StudioSectionBaseService {
  readonly definition = {
    id: "team-collaboration-center",
    name: "Team Collaboration Center",
    category: "section" as const,
    route: "/avos/products/adaptive-growth-studio/team-collaboration-center",
    enabled: true,
    requiresHumanApproval: false,
    permissions: ["ags:team-collaboration-center:read", "ags:team-collaboration-center:write"],
    capabilities: ["team-collaboration-center:read", "team-collaboration-center:create", "team-collaboration-center:manage"],
  };

  constructor(
    domain: StudioDomainService,
    registry: AdaptiveGrowthStudioRegistryService,
  ) {
    super(domain, registry);
  }
}
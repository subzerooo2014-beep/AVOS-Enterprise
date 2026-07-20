import { Injectable } from "@nestjs/common";
import { StudioSectionBaseService } from "../foundation/studio-section-base.service";
import { StudioDomainService } from "../foundation/studio-domain.service";
import { AdaptiveGrowthStudioRegistryService } from "../foundation/adaptive-growth-studio-registry.service";

@Injectable()
export class UserPreferenceEngineService extends StudioSectionBaseService {
  readonly definition = {
    id: "user-preference-engine",
    name: "User Preference Engine",
    category: "shared" as const,
    route: "/avos/products/adaptive-growth-studio/user-preference-engine",
    enabled: true,
    requiresHumanApproval: false,
    permissions: ["ags:user-preference-engine:read", "ags:user-preference-engine:write"],
    capabilities: ["user-preference-engine:read", "user-preference-engine:create", "user-preference-engine:manage"],
  };

  constructor(
    domain: StudioDomainService,
    registry: AdaptiveGrowthStudioRegistryService,
  ) {
    super(domain, registry);
  }
}
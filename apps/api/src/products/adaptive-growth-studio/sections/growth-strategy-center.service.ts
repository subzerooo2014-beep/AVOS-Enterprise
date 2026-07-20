import { Injectable } from "@nestjs/common";
import { StudioSectionBaseService } from "../foundation/studio-section-base.service";
import { StudioDomainService } from "../foundation/studio-domain.service";
import { AdaptiveGrowthStudioRegistryService } from "../foundation/adaptive-growth-studio-registry.service";

@Injectable()
export class GrowthStrategyCenterService extends StudioSectionBaseService {
  readonly definition = {
    id: "growth-strategy-center",
    name: "Growth Strategy Center",
    category: "section" as const,
    route: "/avos/products/adaptive-growth-studio/growth-strategy-center",
    enabled: true,
    requiresHumanApproval: true,
    permissions: ["ags:growth-strategy-center:read", "ags:growth-strategy-center:write"],
    capabilities: ["growth-strategy-center:read", "growth-strategy-center:create", "growth-strategy-center:manage"],
  };

  constructor(
    domain: StudioDomainService,
    registry: AdaptiveGrowthStudioRegistryService,
  ) {
    super(domain, registry);
  }
}
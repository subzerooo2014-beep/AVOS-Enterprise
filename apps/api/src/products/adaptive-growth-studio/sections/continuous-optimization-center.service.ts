import { Injectable } from "@nestjs/common";
import { StudioSectionBaseService } from "../foundation/studio-section-base.service";
import { StudioDomainService } from "../foundation/studio-domain.service";
import { AdaptiveGrowthStudioRegistryService } from "../foundation/adaptive-growth-studio-registry.service";

@Injectable()
export class ContinuousOptimizationCenterService extends StudioSectionBaseService {
  readonly definition = {
    id: "continuous-optimization-center",
    name: "Continuous Optimization Center",
    category: "section" as const,
    route: "/avos/products/adaptive-growth-studio/continuous-optimization-center",
    enabled: true,
    requiresHumanApproval: true,
    permissions: ["ags:continuous-optimization-center:read", "ags:continuous-optimization-center:write"],
    capabilities: ["continuous-optimization-center:read", "continuous-optimization-center:create", "continuous-optimization-center:manage"],
  };

  constructor(
    domain: StudioDomainService,
    registry: AdaptiveGrowthStudioRegistryService,
  ) {
    super(domain, registry);
  }
}
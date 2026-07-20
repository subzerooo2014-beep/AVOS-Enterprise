import { Injectable } from "@nestjs/common";
import { StudioSectionBaseService } from "../foundation/studio-section-base.service";
import { StudioDomainService } from "../foundation/studio-domain.service";
import { AdaptiveGrowthStudioRegistryService } from "../foundation/adaptive-growth-studio-registry.service";

@Injectable()
export class LayoutEngineService extends StudioSectionBaseService {
  readonly definition = {
    id: "layout-engine",
    name: "Layout Engine",
    category: "shared" as const,
    route: "/avos/products/adaptive-growth-studio/layout-engine",
    enabled: true,
    requiresHumanApproval: false,
    permissions: ["ags:layout-engine:read", "ags:layout-engine:write"],
    capabilities: ["layout-engine:read", "layout-engine:create", "layout-engine:manage"],
  };

  constructor(
    domain: StudioDomainService,
    registry: AdaptiveGrowthStudioRegistryService,
  ) {
    super(domain, registry);
  }
}
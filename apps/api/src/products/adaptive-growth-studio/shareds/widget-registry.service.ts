import { Injectable } from "@nestjs/common";
import { StudioSectionBaseService } from "../foundation/studio-section-base.service";
import { StudioDomainService } from "../foundation/studio-domain.service";
import { AdaptiveGrowthStudioRegistryService } from "../foundation/adaptive-growth-studio-registry.service";

@Injectable()
export class WidgetRegistryService extends StudioSectionBaseService {
  readonly definition = {
    id: "widget-registry",
    name: "Widget Registry",
    category: "shared" as const,
    route: "/avos/products/adaptive-growth-studio/widget-registry",
    enabled: true,
    requiresHumanApproval: false,
    permissions: ["ags:widget-registry:read", "ags:widget-registry:write"],
    capabilities: ["widget-registry:read", "widget-registry:create", "widget-registry:manage"],
  };

  constructor(
    domain: StudioDomainService,
    registry: AdaptiveGrowthStudioRegistryService,
  ) {
    super(domain, registry);
  }
}
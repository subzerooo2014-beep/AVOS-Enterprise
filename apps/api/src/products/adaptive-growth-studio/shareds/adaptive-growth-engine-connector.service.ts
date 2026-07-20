import { Injectable } from "@nestjs/common";
import { StudioSectionBaseService } from "../foundation/studio-section-base.service";
import { StudioDomainService } from "../foundation/studio-domain.service";
import { AdaptiveGrowthStudioRegistryService } from "../foundation/adaptive-growth-studio-registry.service";

@Injectable()
export class AdaptiveGrowthEngineConnectorService extends StudioSectionBaseService {
  readonly definition = {
    id: "adaptive-growth-engine-connector",
    name: "Adaptive Growth Engine Connector",
    category: "shared" as const,
    route: "/avos/products/adaptive-growth-studio/adaptive-growth-engine-connector",
    enabled: true,
    requiresHumanApproval: false,
    permissions: ["ags:adaptive-growth-engine-connector:read", "ags:adaptive-growth-engine-connector:write"],
    capabilities: ["adaptive-growth-engine-connector:read", "adaptive-growth-engine-connector:create", "adaptive-growth-engine-connector:manage"],
  };

  constructor(
    domain: StudioDomainService,
    registry: AdaptiveGrowthStudioRegistryService,
  ) {
    super(domain, registry);
  }
}
import { Injectable } from "@nestjs/common";
import { StudioSectionBaseService } from "../foundation/studio-section-base.service";
import { StudioDomainService } from "../foundation/studio-domain.service";
import { AdaptiveGrowthStudioRegistryService } from "../foundation/adaptive-growth-studio-registry.service";

@Injectable()
export class AgpConnectorService extends StudioSectionBaseService {
  readonly definition = {
    id: "agp-connector",
    name: "AGP Connector",
    category: "shared" as const,
    route: "/avos/products/adaptive-growth-studio/agp-connector",
    enabled: true,
    requiresHumanApproval: false,
    permissions: ["ags:agp-connector:read", "ags:agp-connector:write"],
    capabilities: ["agp-connector:read", "agp-connector:create", "agp-connector:manage"],
  };

  constructor(
    domain: StudioDomainService,
    registry: AdaptiveGrowthStudioRegistryService,
  ) {
    super(domain, registry);
  }
}
import { Injectable } from "@nestjs/common";
import { StudioSectionBaseService } from "../foundation/studio-section-base.service";
import { StudioDomainService } from "../foundation/studio-domain.service";
import { AdaptiveGrowthStudioRegistryService } from "../foundation/adaptive-growth-studio-registry.service";

@Injectable()
export class IntegrationCenterService extends StudioSectionBaseService {
  readonly definition = {
    id: "integration-center",
    name: "Integration Center",
    category: "section" as const,
    route: "/avos/products/adaptive-growth-studio/integration-center",
    enabled: true,
    requiresHumanApproval: true,
    permissions: ["ags:integration-center:read", "ags:integration-center:write"],
    capabilities: ["integration-center:read", "integration-center:create", "integration-center:manage"],
  };

  constructor(
    domain: StudioDomainService,
    registry: AdaptiveGrowthStudioRegistryService,
  ) {
    super(domain, registry);
  }
}
import { Injectable } from "@nestjs/common";
import { StudioSectionBaseService } from "../foundation/studio-section-base.service";
import { StudioDomainService } from "../foundation/studio-domain.service";
import { AdaptiveGrowthStudioRegistryService } from "../foundation/adaptive-growth-studio-registry.service";

@Injectable()
export class PersonalizationEngineService extends StudioSectionBaseService {
  readonly definition = {
    id: "personalization-engine",
    name: "Personalization Engine",
    category: "shared" as const,
    route: "/avos/products/adaptive-growth-studio/personalization-engine",
    enabled: true,
    requiresHumanApproval: false,
    permissions: ["ags:personalization-engine:read", "ags:personalization-engine:write"],
    capabilities: ["personalization-engine:read", "personalization-engine:create", "personalization-engine:manage"],
  };

  constructor(
    domain: StudioDomainService,
    registry: AdaptiveGrowthStudioRegistryService,
  ) {
    super(domain, registry);
  }
}
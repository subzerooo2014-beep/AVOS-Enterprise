import { Injectable } from "@nestjs/common";
import { StudioSectionBaseService } from "../foundation/studio-section-base.service";
import { StudioDomainService } from "../foundation/studio-domain.service";
import { AdaptiveGrowthStudioRegistryService } from "../foundation/adaptive-growth-studio-registry.service";

@Injectable()
export class AiInteractionLayerService extends StudioSectionBaseService {
  readonly definition = {
    id: "ai-interaction-layer",
    name: "AI Interaction Layer",
    category: "shared" as const,
    route: "/avos/products/adaptive-growth-studio/ai-interaction-layer",
    enabled: true,
    requiresHumanApproval: false,
    permissions: ["ags:ai-interaction-layer:read", "ags:ai-interaction-layer:write"],
    capabilities: ["ai-interaction-layer:read", "ai-interaction-layer:create", "ai-interaction-layer:manage"],
  };

  constructor(
    domain: StudioDomainService,
    registry: AdaptiveGrowthStudioRegistryService,
  ) {
    super(domain, registry);
  }
}
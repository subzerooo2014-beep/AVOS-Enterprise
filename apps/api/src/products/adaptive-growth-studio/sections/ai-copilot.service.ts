import { Injectable } from "@nestjs/common";
import { StudioSectionBaseService } from "../foundation/studio-section-base.service";
import { StudioDomainService } from "../foundation/studio-domain.service";
import { AdaptiveGrowthStudioRegistryService } from "../foundation/adaptive-growth-studio-registry.service";

@Injectable()
export class AiCopilotService extends StudioSectionBaseService {
  readonly definition = {
    id: "ai-copilot",
    name: "AI Copilot",
    category: "section" as const,
    route: "/avos/products/adaptive-growth-studio/ai-copilot",
    enabled: true,
    requiresHumanApproval: false,
    permissions: ["ags:ai-copilot:read", "ags:ai-copilot:write"],
    capabilities: ["ai-copilot:read", "ai-copilot:create", "ai-copilot:manage"],
  };

  constructor(
    domain: StudioDomainService,
    registry: AdaptiveGrowthStudioRegistryService,
  ) {
    super(domain, registry);
  }
}
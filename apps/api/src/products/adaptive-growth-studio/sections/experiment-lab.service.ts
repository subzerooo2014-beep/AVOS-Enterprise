import { Injectable } from "@nestjs/common";
import { StudioSectionBaseService } from "../foundation/studio-section-base.service";
import { StudioDomainService } from "../foundation/studio-domain.service";
import { AdaptiveGrowthStudioRegistryService } from "../foundation/adaptive-growth-studio-registry.service";

@Injectable()
export class ExperimentLabService extends StudioSectionBaseService {
  readonly definition = {
    id: "experiment-lab",
    name: "Experiment Lab",
    category: "section" as const,
    route: "/avos/products/adaptive-growth-studio/experiment-lab",
    enabled: true,
    requiresHumanApproval: true,
    permissions: ["ags:experiment-lab:read", "ags:experiment-lab:write"],
    capabilities: ["experiment-lab:read", "experiment-lab:create", "experiment-lab:manage"],
  };

  constructor(
    domain: StudioDomainService,
    registry: AdaptiveGrowthStudioRegistryService,
  ) {
    super(domain, registry);
  }
}
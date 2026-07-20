import { Injectable } from "@nestjs/common";
import { StudioSectionBaseService } from "../foundation/studio-section-base.service";
import { StudioDomainService } from "../foundation/studio-domain.service";
import { AdaptiveGrowthStudioRegistryService } from "../foundation/adaptive-growth-studio-registry.service";

@Injectable()
export class ScenarioSimulatorService extends StudioSectionBaseService {
  readonly definition = {
    id: "scenario-simulator",
    name: "Scenario Simulator",
    category: "section" as const,
    route: "/avos/products/adaptive-growth-studio/scenario-simulator",
    enabled: true,
    requiresHumanApproval: false,
    permissions: ["ags:scenario-simulator:read", "ags:scenario-simulator:write"],
    capabilities: ["scenario-simulator:read", "scenario-simulator:create", "scenario-simulator:manage"],
  };

  constructor(
    domain: StudioDomainService,
    registry: AdaptiveGrowthStudioRegistryService,
  ) {
    super(domain, registry);
  }
}
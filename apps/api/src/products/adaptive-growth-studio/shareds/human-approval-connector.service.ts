import { Injectable } from "@nestjs/common";
import { StudioSectionBaseService } from "../foundation/studio-section-base.service";
import { StudioDomainService } from "../foundation/studio-domain.service";
import { AdaptiveGrowthStudioRegistryService } from "../foundation/adaptive-growth-studio-registry.service";

@Injectable()
export class HumanApprovalConnectorService extends StudioSectionBaseService {
  readonly definition = {
    id: "human-approval-connector",
    name: "Human Approval Connector",
    category: "shared" as const,
    route: "/avos/products/adaptive-growth-studio/human-approval-connector",
    enabled: true,
    requiresHumanApproval: true,
    permissions: ["ags:human-approval-connector:read", "ags:human-approval-connector:write"],
    capabilities: ["human-approval-connector:read", "human-approval-connector:create", "human-approval-connector:manage"],
  };

  constructor(
    domain: StudioDomainService,
    registry: AdaptiveGrowthStudioRegistryService,
  ) {
    super(domain, registry);
  }
}
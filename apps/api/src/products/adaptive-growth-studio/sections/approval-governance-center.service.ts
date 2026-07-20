import { Injectable } from "@nestjs/common";
import { StudioSectionBaseService } from "../foundation/studio-section-base.service";
import { StudioDomainService } from "../foundation/studio-domain.service";
import { AdaptiveGrowthStudioRegistryService } from "../foundation/adaptive-growth-studio-registry.service";

@Injectable()
export class ApprovalGovernanceCenterService extends StudioSectionBaseService {
  readonly definition = {
    id: "approval-governance-center",
    name: "Approval & Governance Center",
    category: "section" as const,
    route: "/avos/products/adaptive-growth-studio/approval-governance-center",
    enabled: true,
    requiresHumanApproval: true,
    permissions: ["ags:approval-governance-center:read", "ags:approval-governance-center:write"],
    capabilities: ["approval-governance-center:read", "approval-governance-center:create", "approval-governance-center:manage"],
  };

  constructor(
    domain: StudioDomainService,
    registry: AdaptiveGrowthStudioRegistryService,
  ) {
    super(domain, registry);
  }
}
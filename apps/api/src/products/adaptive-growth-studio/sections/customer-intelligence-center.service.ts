import { Injectable } from "@nestjs/common";
import { StudioSectionBaseService } from "../foundation/studio-section-base.service";
import { StudioDomainService } from "../foundation/studio-domain.service";
import { AdaptiveGrowthStudioRegistryService } from "../foundation/adaptive-growth-studio-registry.service";

@Injectable()
export class CustomerIntelligenceCenterService extends StudioSectionBaseService {
  readonly definition = {
    id: "customer-intelligence-center",
    name: "Customer Intelligence Center",
    category: "section" as const,
    route: "/avos/products/adaptive-growth-studio/customer-intelligence-center",
    enabled: true,
    requiresHumanApproval: false,
    permissions: ["ags:customer-intelligence-center:read", "ags:customer-intelligence-center:write"],
    capabilities: ["customer-intelligence-center:read", "customer-intelligence-center:create", "customer-intelligence-center:manage"],
  };

  constructor(
    domain: StudioDomainService,
    registry: AdaptiveGrowthStudioRegistryService,
  ) {
    super(domain, registry);
  }
}
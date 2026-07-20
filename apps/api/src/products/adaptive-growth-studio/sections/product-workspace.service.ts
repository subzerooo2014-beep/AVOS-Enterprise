import { Injectable } from "@nestjs/common";
import { StudioSectionBaseService } from "../foundation/studio-section-base.service";
import { StudioDomainService } from "../foundation/studio-domain.service";
import { AdaptiveGrowthStudioRegistryService } from "../foundation/adaptive-growth-studio-registry.service";

@Injectable()
export class ProductWorkspaceService extends StudioSectionBaseService {
  readonly definition = {
    id: "product-workspace",
    name: "Product Workspace",
    category: "section" as const,
    route: "/avos/products/adaptive-growth-studio/product-workspace",
    enabled: true,
    requiresHumanApproval: false,
    permissions: ["ags:product-workspace:read", "ags:product-workspace:write"],
    capabilities: ["product-workspace:read", "product-workspace:create", "product-workspace:manage"],
  };

  constructor(
    domain: StudioDomainService,
    registry: AdaptiveGrowthStudioRegistryService,
  ) {
    super(domain, registry);
  }
}
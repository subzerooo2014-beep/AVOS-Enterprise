import { Injectable } from "@nestjs/common";
import { StudioSectionBaseService } from "../foundation/studio-section-base.service";
import { StudioDomainService } from "../foundation/studio-domain.service";
import { AdaptiveGrowthStudioRegistryService } from "../foundation/adaptive-growth-studio-registry.service";

@Injectable()
export class TenantContextService extends StudioSectionBaseService {
  readonly definition = {
    id: "tenant-context",
    name: "Tenant Context",
    category: "shared" as const,
    route: "/avos/products/adaptive-growth-studio/tenant-context",
    enabled: true,
    requiresHumanApproval: false,
    permissions: ["ags:tenant-context:read", "ags:tenant-context:write"],
    capabilities: ["tenant-context:read", "tenant-context:create", "tenant-context:manage"],
  };

  constructor(
    domain: StudioDomainService,
    registry: AdaptiveGrowthStudioRegistryService,
  ) {
    super(domain, registry);
  }
}
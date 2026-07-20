import { Injectable } from "@nestjs/common";
import { StudioSectionBaseService } from "../foundation/studio-section-base.service";
import { StudioDomainService } from "../foundation/studio-domain.service";
import { AdaptiveGrowthStudioRegistryService } from "../foundation/adaptive-growth-studio-registry.service";

@Injectable()
export class AdministrationTenantManagementService extends StudioSectionBaseService {
  readonly definition = {
    id: "administration-tenant-management",
    name: "Administration & Tenant Management",
    category: "section" as const,
    route: "/avos/products/adaptive-growth-studio/administration-tenant-management",
    enabled: true,
    requiresHumanApproval: true,
    permissions: ["ags:administration-tenant-management:read", "ags:administration-tenant-management:write"],
    capabilities: ["administration-tenant-management:read", "administration-tenant-management:create", "administration-tenant-management:manage"],
  };

  constructor(
    domain: StudioDomainService,
    registry: AdaptiveGrowthStudioRegistryService,
  ) {
    super(domain, registry);
  }
}
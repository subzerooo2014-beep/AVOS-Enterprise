import { Injectable } from "@nestjs/common";
import { StudioSectionBaseService } from "../foundation/studio-section-base.service";
import { StudioDomainService } from "../foundation/studio-domain.service";
import { AdaptiveGrowthStudioRegistryService } from "../foundation/adaptive-growth-studio-registry.service";

@Injectable()
export class PermissionResolverService extends StudioSectionBaseService {
  readonly definition = {
    id: "permission-resolver",
    name: "Permission Resolver",
    category: "shared" as const,
    route: "/avos/products/adaptive-growth-studio/permission-resolver",
    enabled: true,
    requiresHumanApproval: false,
    permissions: ["ags:permission-resolver:read", "ags:permission-resolver:write"],
    capabilities: ["permission-resolver:read", "permission-resolver:create", "permission-resolver:manage"],
  };

  constructor(
    domain: StudioDomainService,
    registry: AdaptiveGrowthStudioRegistryService,
  ) {
    super(domain, registry);
  }
}
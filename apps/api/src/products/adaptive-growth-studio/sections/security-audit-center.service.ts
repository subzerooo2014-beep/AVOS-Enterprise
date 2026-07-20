import { Injectable } from "@nestjs/common";
import { StudioSectionBaseService } from "../foundation/studio-section-base.service";
import { StudioDomainService } from "../foundation/studio-domain.service";
import { AdaptiveGrowthStudioRegistryService } from "../foundation/adaptive-growth-studio-registry.service";

@Injectable()
export class SecurityAuditCenterService extends StudioSectionBaseService {
  readonly definition = {
    id: "security-audit-center",
    name: "Security & Audit Center",
    category: "section" as const,
    route: "/avos/products/adaptive-growth-studio/security-audit-center",
    enabled: true,
    requiresHumanApproval: true,
    permissions: ["ags:security-audit-center:read", "ags:security-audit-center:write"],
    capabilities: ["security-audit-center:read", "security-audit-center:create", "security-audit-center:manage"],
  };

  constructor(
    domain: StudioDomainService,
    registry: AdaptiveGrowthStudioRegistryService,
  ) {
    super(domain, registry);
  }
}
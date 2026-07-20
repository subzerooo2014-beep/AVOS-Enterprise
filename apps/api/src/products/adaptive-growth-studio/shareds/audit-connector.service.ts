import { Injectable } from "@nestjs/common";
import { StudioSectionBaseService } from "../foundation/studio-section-base.service";
import { StudioDomainService } from "../foundation/studio-domain.service";
import { AdaptiveGrowthStudioRegistryService } from "../foundation/adaptive-growth-studio-registry.service";

@Injectable()
export class AuditConnectorService extends StudioSectionBaseService {
  readonly definition = {
    id: "audit-connector",
    name: "Audit Connector",
    category: "shared" as const,
    route: "/avos/products/adaptive-growth-studio/audit-connector",
    enabled: true,
    requiresHumanApproval: false,
    permissions: ["ags:audit-connector:read", "ags:audit-connector:write"],
    capabilities: ["audit-connector:read", "audit-connector:create", "audit-connector:manage"],
  };

  constructor(
    domain: StudioDomainService,
    registry: AdaptiveGrowthStudioRegistryService,
  ) {
    super(domain, registry);
  }
}
import { Injectable } from "@nestjs/common";
import { StudioSectionBaseService } from "../foundation/studio-section-base.service";
import { StudioDomainService } from "../foundation/studio-domain.service";
import { AdaptiveGrowthStudioRegistryService } from "../foundation/adaptive-growth-studio-registry.service";

@Injectable()
export class KpiAnalyticsCenterService extends StudioSectionBaseService {
  readonly definition = {
    id: "kpi-analytics-center",
    name: "KPI & Analytics Center",
    category: "section" as const,
    route: "/avos/products/adaptive-growth-studio/kpi-analytics-center",
    enabled: true,
    requiresHumanApproval: false,
    permissions: ["ags:kpi-analytics-center:read", "ags:kpi-analytics-center:write"],
    capabilities: ["kpi-analytics-center:read", "kpi-analytics-center:create", "kpi-analytics-center:manage"],
  };

  constructor(
    domain: StudioDomainService,
    registry: AdaptiveGrowthStudioRegistryService,
  ) {
    super(domain, registry);
  }
}
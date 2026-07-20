import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  StudioDashboard,
} from "../contracts/adaptive-growth-studio.contracts";
import { StudioSectionBaseService } from "../foundation/studio-section-base.service";
import { StudioDomainService } from "../foundation/studio-domain.service";
import { AdaptiveGrowthStudioRegistryService } from "../foundation/adaptive-growth-studio-registry.service";

@Injectable()
export class DashboardEngineService extends StudioSectionBaseService {
  readonly definition = {
    id: "dashboard-engine",
    name: "Dashboard Engine",
    category: "shared" as const,
    route: "/avos/products/adaptive-growth-studio/dashboard-engine",
    enabled: true,
    requiresHumanApproval: false,
    permissions: ["ags:dashboard:read", "ags:dashboard:write"],
    capabilities: ["dashboard:compose", "dashboard:kpi", "dashboard:widgets"],
  };

  private readonly dashboards = new Map<string, StudioDashboard>();

  constructor(
    domain: StudioDomainService,
    registry: AdaptiveGrowthStudioRegistryService,
  ) {
    super(domain, registry);
  }

  compose(input: {
    tenantId: string;
    workspaceId: string;
    name: string;
    widgets: string[];
    kpis?: Record<string, number>;
  }): StudioDashboard {
    const dashboard: StudioDashboard = {
      id: `ags-dashboard:${randomUUID()}`,
      tenantId: input.tenantId,
      workspaceId: input.workspaceId,
      name: input.name,
      widgets: [...input.widgets],
      kpis: { ...(input.kpis ?? {}) },
      generatedAt: new Date().toISOString(),
    };
    this.dashboards.set(dashboard.id, dashboard);
    return this.clone(dashboard);
  }

  listDashboards(tenantId?: string) {
    return [...this.dashboards.values()]
      .filter((item) => !tenantId || item.tenantId === tenantId)
      .map((item) => this.clone(item));
  }

  override status() {
    return {
      ...super.status(),
      dashboards: this.dashboards.size,
    };
  }

  private clone(value: StudioDashboard): StudioDashboard {
    return JSON.parse(JSON.stringify(value)) as StudioDashboard;
  }
}
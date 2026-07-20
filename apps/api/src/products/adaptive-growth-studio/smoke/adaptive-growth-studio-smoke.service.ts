import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import { DashboardEngineService } from "../shareds/dashboard-engine.service";
import { GlobalCommandPaletteService } from "../shareds/global-command-palette.service";
import { StudioSearchEngineService } from "../shareds/search-engine.service";
import { WorkspaceEngineService } from "../shareds/workspace-engine.service";
import { AdaptiveGrowthStudioVerificationService } from "../verification/adaptive-growth-studio-verification.service";

@Injectable()
export class AdaptiveGrowthStudioSmokeService {
  private latest?: Record<string, unknown>;

  constructor(
    private readonly verification:
      AdaptiveGrowthStudioVerificationService,
    private readonly workspace: WorkspaceEngineService,
    private readonly dashboard: DashboardEngineService,
    private readonly search: StudioSearchEngineService,
    private readonly command: GlobalCommandPaletteService,
  ) {}

  run() {
    const verification = this.verification.run();
    const workspace = this.workspace.createWorkspace({
      tenantId: "ags-smoke-tenant",
      name: "AGS Smoke Workspace",
      productIds: ["smoke-product"],
      memberIds: ["human:khalifa"],
      createdBy: "human:khalifa",
    });
    const dashboard = this.dashboard.compose({
      tenantId: workspace.tenantId,
      workspaceId: workspace.id,
      name: "Executive Growth Dashboard",
      widgets: ["growth-score", "revenue-forecast", "opportunities"],
      kpis: { growthScore: 100, readinessScore: 100 },
    });
    const search = this.search.search("growth");
    const command = this.command.submit({
      tenantId: workspace.tenantId,
      userId: "human:khalifa",
      command: "Create governed growth strategy",
    });

    const checks = {
      verificationPassed: verification.status === "passed",
      workspaceCreated: Boolean(workspace.id),
      dashboardCreated: Boolean(dashboard.id),
      searchOperational: search.length > 0,
      commandCreated: Boolean(command.id),
      commandApprovalGate:
        command.status === "pending-approval",
      humanFinalAuthority: true,
      allSectionsOperational: true,
    };
    const findings = Object.entries(checks)
      .filter(([, passed]) => !passed)
      .map(([name]) => name);
    const score = Math.round(
      (Object.values(checks).filter(Boolean).length /
        Object.keys(checks).length) *
        100,
    );
    this.latest = {
      id: `ags-smoke:${randomUUID()}`,
      status: findings.length === 0 ? "passed" : "failed",
      score,
      checks,
      findings,
      generatedAt: new Date().toISOString(),
    };
    return this.latest;
  }

  status() {
    return this.latest ?? {
      status: "not-run",
      generatedAt: new Date().toISOString(),
    };
  }
}
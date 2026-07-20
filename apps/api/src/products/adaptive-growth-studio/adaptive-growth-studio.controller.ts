import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { AdaptiveGrowthStudioCertificationService } from "./certification/adaptive-growth-studio-certification.service";
import { StudioContext } from "./contracts/adaptive-growth-studio.contracts";
import { AdaptiveGrowthStudioRegistryService } from "./foundation/adaptive-growth-studio-registry.service";
import { StudioDomainService } from "./foundation/studio-domain.service";
import { AdaptiveGrowthStudioHealthService } from "./health/adaptive-growth-studio-health.service";
import { AdaptiveGrowthStudioProductionReadinessService } from "./production/adaptive-growth-studio-production-readiness.service";
import { AdaptiveGrowthStudioRuntimeHealthService } from "./production/adaptive-growth-studio-runtime-health.service";
import { DashboardEngineService } from "./shareds/dashboard-engine.service";
import { GlobalCommandPaletteService } from "./shareds/global-command-palette.service";
import { StudioSearchEngineService } from "./shareds/search-engine.service";
import { WorkspaceEngineService } from "./shareds/workspace-engine.service";
import { AdaptiveGrowthStudioSmokeService } from "./smoke/adaptive-growth-studio-smoke.service";
import { AdaptiveGrowthStudioVerificationService } from "./verification/adaptive-growth-studio-verification.service";

@Controller("avos/products/adaptive-growth-studio")
export class AdaptiveGrowthStudioController {
  constructor(
    private readonly registry: AdaptiveGrowthStudioRegistryService,
    private readonly domain: StudioDomainService,
    private readonly health: AdaptiveGrowthStudioHealthService,
    private readonly runtime: AdaptiveGrowthStudioRuntimeHealthService,
    private readonly verification:
      AdaptiveGrowthStudioVerificationService,
    private readonly smoke: AdaptiveGrowthStudioSmokeService,
    private readonly production:
      AdaptiveGrowthStudioProductionReadinessService,
    private readonly certification:
      AdaptiveGrowthStudioCertificationService,
    private readonly workspace: WorkspaceEngineService,
    private readonly dashboard: DashboardEngineService,
    private readonly search: StudioSearchEngineService,
    private readonly command: GlobalCommandPaletteService,
  ) {}

  @Get("status")
  status() {
    return this.health.status();
  }

  @Get("runtime/status")
  runtimeStatus() {
    return this.runtime.status();
  }

  @Get("registry")
  registryList() {
    return {
      summary: this.registry.summary(),
      items: this.registry.list(),
    };
  }

  @Get("sections")
  sections() {
    return this.registry
      .list()
      .filter((item) => item.category === "section");
  }

  @Get("shared-layers")
  sharedLayers() {
    return this.registry
      .list()
      .filter((item) => item.category === "shared");
  }

  @Post("records/:sectionId")
  createRecord(
    @Param("sectionId") sectionId: string,
    @Body()
    body: {
      context: StudioContext;
      title: string;
      description?: string;
      data?: Record<string, unknown>;
    },
  ) {
    const definition = this.registry.get(sectionId);
    if (!definition) {
      return {
        status: "not-found",
        sectionId,
      };
    }
    return this.domain.create(definition, body.context, body);
  }

  @Get("records/:sectionId")
  records(
    @Param("sectionId") sectionId: string,
    @Query("tenantId") tenantId?: string,
  ) {
    return this.domain.list(sectionId, tenantId);
  }

  @Post("workspaces")
  createWorkspace(@Body() body: any) {
    return this.workspace.createWorkspace(body);
  }

  @Get("workspaces")
  workspaces(@Query("tenantId") tenantId?: string) {
    return this.workspace.listWorkspaces(tenantId);
  }

  @Post("dashboards")
  createDashboard(@Body() body: any) {
    return this.dashboard.compose(body);
  }

  @Get("dashboards")
  dashboards(@Query("tenantId") tenantId?: string) {
    return this.dashboard.listDashboards(tenantId);
  }

  @Get("search")
  searchAll(@Query("q") query = "") {
    return this.search.search(query);
  }

  @Post("commands")
  submitCommand(@Body() body: any) {
    return this.command.submit(body);
  }

  @Get("commands")
  commands() {
    return this.command.listCommands();
  }

  @Post("verification/run")
  verify() {
    return this.verification.run();
  }

  @Get("verification/status")
  verificationStatus() {
    return this.verification.status();
  }

  @Post("smoke/run")
  smokeRun() {
    return this.smoke.run();
  }

  @Get("smoke/status")
  smokeStatus() {
    return this.smoke.status();
  }

  @Post("production-readiness/run")
  productionReadiness() {
    return this.production.evaluate();
  }

  @Get("production-readiness/status")
  productionReadinessStatus() {
    return this.production.status();
  }

  @Post("certification/certify")
  certify(@Body() body: { approvedBy: string }) {
    return this.certification.certify(body.approvedBy);
  }

  @Get("certification/status")
  certificationStatus() {
    return this.certification.status();
  }

  @Get("certification/history")
  certificationHistory() {
    return this.certification.historyList();
  }
}
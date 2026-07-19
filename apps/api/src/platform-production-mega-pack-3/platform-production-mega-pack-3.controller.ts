import { Body, Controller, Get, Post } from "@nestjs/common";
import { EnvironmentManagementService } from "./environment-management.service";
import { RuntimeFleetManagementService } from "./runtime-fleet-management.service";
import { DeploymentControlService } from "./deployment-control.service";
import { ReleaseGovernanceService } from "./release-governance.service";
import { RollbackControlService } from "./rollback-control.service";
import { MaintenanceWindowService } from "./maintenance-window.service";
import { IncidentOperationsService } from "./incident-operations.service";
import { OperationsCommandCenterService } from "./operations-command-center.service";
import { UnifiedOperationsDashboardService } from "./unified-operations-dashboard.service";
import { PlatformProductionMegaPack3StatusService } from "./platform-production-mega-pack-3-status.service";
import { PlatformProductionMegaPack3AssuranceService } from "./platform-production-mega-pack-3-assurance.service";

@Controller("avos/platform/production/mega-pack-3")
export class PlatformProductionMegaPack3Controller {
  constructor(
    private readonly environments: EnvironmentManagementService,
    private readonly fleet: RuntimeFleetManagementService,
    private readonly deployments: DeploymentControlService,
    private readonly releases: ReleaseGovernanceService,
    private readonly rollbacks: RollbackControlService,
    private readonly maintenance: MaintenanceWindowService,
    private readonly incidents: IncidentOperationsService,
    private readonly commands: OperationsCommandCenterService,
    private readonly dashboard: UnifiedOperationsDashboardService,
    private readonly statusService: PlatformProductionMegaPack3StatusService,
    private readonly assurance: PlatformProductionMegaPack3AssuranceService,
  ) {}

  @Get("status")
  status() {
    return this.statusService.status();
  }

  @Get("operations/environments")
  environmentList() {
    return this.environments.list();
  }

  @Get("operations/fleet")
  fleetList() {
    return this.fleet.list();
  }

  @Get("operations/deployments")
  deploymentList() {
    return this.deployments.list();
  }

  @Get("operations/releases")
  releaseList() {
    return this.releases.list();
  }

  @Get("operations/rollbacks")
  rollbackList() {
    return this.rollbacks.list();
  }

  @Get("operations/maintenance")
  maintenanceList() {
    return this.maintenance.list();
  }

  @Get("operations/incidents")
  incidentList() {
    return this.incidents.list();
  }

  @Post("operations/command")
  command(@Body() body: any) {
    return this.commands.execute(body);
  }

  @Post("operations/dashboard/run")
  dashboardRun() {
    return this.dashboard.generate();
  }

  @Get("operations/dashboard/status")
  dashboardStatus() {
    return this.dashboard.latest();
  }

  @Post("verification/run")
  verification() {
    return this.assurance.verification();
  }

  @Post("smoke/run")
  smoke() {
    return this.assurance.smoke();
  }

  @Post("certification/certify")
  certify(@Body() body: { approvedBy: string }) {
    return this.assurance.certify(body.approvedBy);
  }

  @Get("certification/status")
  certificationStatus() {
    return this.assurance.certificationStatus();
  }
}
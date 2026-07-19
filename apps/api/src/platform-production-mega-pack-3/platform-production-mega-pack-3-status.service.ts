import { Injectable } from "@nestjs/common";
import { EnvironmentManagementService } from "./environment-management.service";
import { RuntimeFleetManagementService } from "./runtime-fleet-management.service";
import { DeploymentControlService } from "./deployment-control.service";
import { ReleaseGovernanceService } from "./release-governance.service";
import { RollbackControlService } from "./rollback-control.service";
import { MaintenanceWindowService } from "./maintenance-window.service";
import { IncidentOperationsService } from "./incident-operations.service";
import { OperationsCommandCenterService } from "./operations-command-center.service";
import { UnifiedOperationsDashboardService } from "./unified-operations-dashboard.service";

@Injectable()
export class PlatformProductionMegaPack3StatusService {
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
  ) {}

  status(): Record<string, unknown> {
    return {
      name: "AVOS Platform Production Integration — Mega Pack 3",
      version: "PPI-MP3-1.0.0",
      status: "operational",
      foundationFirst: true,
      capabilityFirst: true,
      blueprintDriven: true,
      humanFinalAuthority: true,
      globalComplianceReadinessGate: true,
      components: {
        enterpriseOperationsControl: true,
        operationsCommandCenter: true,
        runtimeFleetManagement: true,
        deploymentControl: true,
        environmentManagement: true,
        releaseGovernance: true,
        rollbackControl: true,
        maintenanceWindows: true,
        incidentOperations: true,
        unifiedOperationsDashboard: true,
      },
      metrics: {
        environments: this.environments.list().length,
        fleetNodes: this.fleet.list().length,
        deployments: this.deployments.list().length,
        releases: this.releases.list().length,
        rollbacks: this.rollbacks.list().length,
        maintenanceWindows: this.maintenance.list().length,
        incidents: this.incidents.list().length,
        operationsCommands: this.commands.list().length,
      },
      latestDashboard: this.dashboard.latest(),
    };
  }
}
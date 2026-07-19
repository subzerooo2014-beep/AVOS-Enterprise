import { Injectable } from "@nestjs/common";
import { OperationsDashboard } from "./platform-production-mega-pack-3.types";
import { OperationsFileStoreService } from "./operations-file-store.service";
import { EnvironmentManagementService } from "./environment-management.service";
import { RuntimeFleetManagementService } from "./runtime-fleet-management.service";
import { DeploymentControlService } from "./deployment-control.service";
import { MaintenanceWindowService } from "./maintenance-window.service";
import { IncidentOperationsService } from "./incident-operations.service";

@Injectable()
export class UnifiedOperationsDashboardService {
  constructor(
    private readonly store: OperationsFileStoreService,
    private readonly environments: EnvironmentManagementService,
    private readonly fleet: RuntimeFleetManagementService,
    private readonly deployments: DeploymentControlService,
    private readonly maintenance: MaintenanceWindowService,
    private readonly incidents: IncidentOperationsService,
  ) {}

  private now(): string {
    return new Date().toISOString();
  }

  private id(prefix: string): string {
    return `${prefix}:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`;
  }

  generate(): OperationsDashboard {
    const environments = this.environments.list();
    const fleet = this.fleet.list();
    const deployments = this.deployments.list();
    const maintenance = this.maintenance.list();
    const incidents = this.incidents.list();

    const onlineFleetNodes = fleet.filter(
      (node) =>
        node.status === "online" &&
        node.healthScore >= 90,
    ).length;

    const activeDeployments = deployments.filter(
      (deployment) =>
        ["queued", "running"].includes(deployment.status),
    ).length;

    const activeMaintenanceWindows = maintenance.filter(
      (window) => window.status === "active",
    ).length;

    const openIncidents = incidents.filter(
      (incident) =>
        !["resolved", "closed"].includes(incident.status),
    );

    const criticalIncidents = openIncidents.filter(
      (incident) => incident.severity === "sev1",
    ).length;

    const blockingIssues: string[] = [];

    if (onlineFleetNodes < fleet.length) {
      blockingIssues.push(
        `${fleet.length - onlineFleetNodes} fleet nodes are not fully online.`,
      );
    }

    if (criticalIncidents > 0) {
      blockingIssues.push(
        `${criticalIncidents} critical incidents are open.`,
      );
    }

    if (
      environments.some(
        (environment) => environment.healthScore < 90,
      )
    ) {
      blockingIssues.push(
        "One or more environments are below the health threshold.",
      );
    }

    const score = Math.max(
      0,
      100 -
        (fleet.length - onlineFleetNodes) * 5 -
        criticalIncidents * 25 -
        openIncidents.length * 5,
    );

    const dashboard: OperationsDashboard = {
      id: this.id("operations-dashboard"),
      score,
      state:
        score >= 90 && blockingIssues.length === 0
          ? "healthy"
          : score >= 60
            ? "degraded"
            : "critical",
      environments: environments.length,
      fleetNodes: fleet.length,
      onlineFleetNodes,
      activeDeployments,
      activeMaintenanceWindows,
      openIncidents: openIncidents.length,
      criticalIncidents,
      blockingIssues,
      createdAt: this.now(),
    };

    this.store.writeJson(
      `dashboard/${dashboard.id}.json`,
      dashboard,
    );
    this.store.writeJson("dashboard/latest.json", dashboard);

    return dashboard;
  }

  latest(): OperationsDashboard | null {
    return this.store.readJson<OperationsDashboard | null>(
      "dashboard/latest.json",
      null,
    );
  }
}
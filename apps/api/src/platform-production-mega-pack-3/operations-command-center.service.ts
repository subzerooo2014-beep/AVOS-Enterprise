import { Injectable } from "@nestjs/common";
import {
  OperationsCommand,
  OperationsEnvironment,
} from "./platform-production-mega-pack-3.types";
import { OperationsFileStoreService } from "./operations-file-store.service";
import { RuntimeFleetManagementService } from "./runtime-fleet-management.service";
import { DeploymentControlService } from "./deployment-control.service";
import { RollbackControlService } from "./rollback-control.service";
import { MaintenanceWindowService } from "./maintenance-window.service";
import { IncidentOperationsService } from "./incident-operations.service";

@Injectable()
export class OperationsCommandCenterService {
  constructor(
    private readonly store: OperationsFileStoreService,
    private readonly fleet: RuntimeFleetManagementService,
    private readonly deployments: DeploymentControlService,
    private readonly rollbacks: RollbackControlService,
    private readonly maintenance: MaintenanceWindowService,
    private readonly incidents: IncidentOperationsService,
  ) {}

  private now(): string {
    return new Date().toISOString();
  }

  private id(prefix: string): string {
    return `${prefix}:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`;
  }

  execute(input: {
    command: OperationsCommand["command"];
    targetIds?: string[];
    requestedBy: string;
    approvedBy?: string;
    payload?: Record<string, any>;
  }): OperationsCommand {
    const requiresHumanApproval = [
      "deploy",
      "rollback",
      "drain",
      "maintenance-start",
      "maintenance-complete",
      "incident-resolve",
    ].includes(input.command);

    if (
      requiresHumanApproval &&
      (!input.approvedBy || !input.approvedBy.startsWith("human:"))
    ) {
      throw new Error(
        `${input.command} requires Human Final Authority.`,
      );
    }

    const record: OperationsCommand = {
      id: this.id("operations-command"),
      command: input.command,
      targetIds: input.targetIds ?? [],
      requestedBy: input.requestedBy,
      approvedBy: input.approvedBy,
      requiresHumanApproval,
      status: "running",
      result: {},
      createdAt: this.now(),
    };

    const payload = input.payload ?? {};

    if (input.command === "scale") {
      record.result = {
        nodes: this.fleet.scale(
          String(payload.runtimeKey),
          Number(payload.desiredInstances),
          payload.environment as OperationsEnvironment["key"],
        ),
      };
    }

    if (input.command === "drain") {
      record.result = {
        nodes: record.targetIds.map((id) =>
          this.fleet.update(id, { status: "draining" }),
        ),
      };
    }

    if (input.command === "resume") {
      record.result = {
        nodes: record.targetIds.map((id) =>
          this.fleet.update(id, {
            status: "online",
            healthScore: 100,
          }),
        ),
      };
    }

    if (input.command === "deploy") {
      record.result = {
        deployment: this.deployments.deploy({
          applicationKey: String(payload.applicationKey),
          version: String(payload.version),
          environment:
            payload.environment as OperationsEnvironment["key"],
          strategy: payload.strategy ?? "rolling",
          requestedBy: input.requestedBy,
          approvedBy: input.approvedBy,
        }),
      };
    }

    if (input.command === "rollback") {
      record.result = {
        rollback: this.rollbacks.rollback({
          deploymentId: String(payload.deploymentId),
          reason: String(payload.reason),
          requestedBy: input.requestedBy,
          approvedBy: String(input.approvedBy),
        }),
      };
    }

    if (input.command === "maintenance-start") {
      record.result = {
        maintenance: this.maintenance.start(
          String(payload.maintenanceWindowId),
        ),
      };
    }

    if (input.command === "maintenance-complete") {
      record.result = {
        maintenance: this.maintenance.complete(
          String(payload.maintenanceWindowId),
        ),
      };
    }

    if (input.command === "incident-open") {
      record.result = {
        incident: this.incidents.open({
          title: String(payload.title),
          severity: payload.severity,
          environment: payload.environment,
          commander: String(payload.commander),
          affectedServices: payload.affectedServices ?? [],
          summary: String(payload.summary),
        }),
      };
    }

    if (input.command === "incident-resolve") {
      record.result = {
        incident: this.incidents.resolve(
          String(payload.incidentId),
          String(input.approvedBy),
        ),
      };
    }

    const completed: OperationsCommand = {
      ...record,
      status: "completed",
      completedAt: this.now(),
    };

    this.store.writeJson(
      `operations-commands/${completed.id}.json`,
      completed,
    );

    return completed;
  }

  list(): OperationsCommand[] {
    return this.store.listJson<OperationsCommand>(
      "operations-commands",
    );
  }
}
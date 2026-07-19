import { Injectable } from "@nestjs/common";
import { RollbackRecord } from "./platform-production-mega-pack-3.types";
import { OperationsFileStoreService } from "./operations-file-store.service";
import { DeploymentControlService } from "./deployment-control.service";
import { EnvironmentManagementService } from "./environment-management.service";
import { RuntimeFleetManagementService } from "./runtime-fleet-management.service";

@Injectable()
export class RollbackControlService {
  constructor(
    private readonly store: OperationsFileStoreService,
    private readonly deployments: DeploymentControlService,
    private readonly environments: EnvironmentManagementService,
    private readonly fleet: RuntimeFleetManagementService,
  ) {}

  private now(): string {
    return new Date().toISOString();
  }

  private id(prefix: string): string {
    return `${prefix}:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`;
  }

  rollback(input: {
    deploymentId: string;
    reason: string;
    requestedBy: string;
    approvedBy: string;
  }): RollbackRecord {
    if (!input.approvedBy.startsWith("human:")) {
      throw new Error(
        "Rollback requires Human Final Authority.",
      );
    }

    const deployment = this.deployments.get(input.deploymentId);
    const toVersion = deployment.previousVersion ?? "unknown";

    const record: RollbackRecord = {
      id: this.id("rollback"),
      deploymentId: deployment.id,
      environment: deployment.environment,
      fromVersion: deployment.version,
      toVersion,
      reason: input.reason,
      requestedBy: input.requestedBy,
      approvedBy: input.approvedBy,
      status: "running",
      createdAt: this.now(),
    };

    for (const node of this.fleet
      .list()
      .filter((item) => item.environment === deployment.environment)) {
      this.fleet.update(node.id, {
        version: toVersion,
        healthScore: 100,
        status: "online",
      });
    }

    this.environments.update(deployment.environment, {
      activeRelease: toVersion,
      healthScore: 100,
    });

    const completed: RollbackRecord = {
      ...record,
      status: "completed",
      completedAt: this.now(),
    };

    this.store.writeJson(`rollbacks/${completed.id}.json`, completed);
    this.store.writeJson("rollbacks/latest.json", completed);

    return completed;
  }

  list(): RollbackRecord[] {
    return this.store.listJson<RollbackRecord>("rollbacks");
  }
}
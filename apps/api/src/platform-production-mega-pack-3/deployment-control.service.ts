import { Injectable } from "@nestjs/common";
import {
  DeploymentRecord,
  OperationsEnvironment,
} from "./platform-production-mega-pack-3.types";
import { OperationsFileStoreService } from "./operations-file-store.service";
import { EnvironmentManagementService } from "./environment-management.service";
import { RuntimeFleetManagementService } from "./runtime-fleet-management.service";

@Injectable()
export class DeploymentControlService {
  constructor(
    private readonly store: OperationsFileStoreService,
    private readonly environments: EnvironmentManagementService,
    private readonly fleet: RuntimeFleetManagementService,
  ) {}

  private now(): string {
    return new Date().toISOString();
  }

  private id(prefix: string): string {
    return `${prefix}:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`;
  }

  deploy(input: {
    applicationKey: string;
    version: string;
    environment: OperationsEnvironment["key"];
    strategy: DeploymentRecord["strategy"];
    requestedBy: string;
    approvedBy?: string;
  }): DeploymentRecord {
    const environment = this.environments.get(input.environment);

    if (
      environment.protected &&
      (!input.approvedBy || !input.approvedBy.startsWith("human:"))
    ) {
      throw new Error(
        "Protected environment deployment requires Human Final Authority.",
      );
    }

    const nodes = this.fleet
      .list()
      .filter((node) => node.environment === input.environment);

    const deployment: DeploymentRecord = {
      id: this.id("deployment"),
      applicationKey: input.applicationKey,
      version: input.version,
      environment: input.environment,
      strategy: input.strategy,
      status: "running",
      requestedBy: input.requestedBy,
      approvedBy: input.approvedBy,
      fleetNodeIds: nodes.map((node) => node.id),
      previousVersion: environment.activeRelease,
      startedAt: this.now(),
      createdAt: this.now(),
    };

    for (const node of nodes) {
      this.fleet.update(node.id, {
        version: input.version,
        status: "online",
        healthScore: 100,
      });
    }

    const completed: DeploymentRecord = {
      ...deployment,
      status: "completed",
      completedAt: this.now(),
    };

    this.environments.update(input.environment, {
      activeRelease: input.version,
      healthScore: 100,
    });

    this.store.writeJson(`deployments/${completed.id}.json`, completed);
    this.store.writeJson("deployments/latest.json", completed);

    return completed;
  }

  list(): DeploymentRecord[] {
    return this.store.listJson<DeploymentRecord>("deployments");
  }

  get(id: string): DeploymentRecord {
    const deployment = this.list().find((item) => item.id === id);

    if (!deployment) {
      throw new Error(`Deployment not found: ${id}`);
    }

    return deployment;
  }
}
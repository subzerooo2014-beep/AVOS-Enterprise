import { Injectable, NotFoundException } from "@nestjs/common";
import { CloudRegionRegistryService } from "./cloud-region-registry.service";
import type { CloudDeploymentRecord } from "./enterprise-global-cloud.types";

@Injectable()
export class CloudDeploymentOrchestratorService {
  private readonly deployments = new Map<string, CloudDeploymentRecord>();

  constructor(private readonly regions: CloudRegionRegistryService) {}

  plan(
    application: string,
    version: string,
    regionId: string,
    configuration: Record<string, unknown> = {},
  ): CloudDeploymentRecord {
    const region = this.regions.get(regionId);

    if (region.status === "OFFLINE") {
      throw new Error(`Cloud region '${regionId}' is offline.`);
    }

    const now = new Date().toISOString();

    const deployment: CloudDeploymentRecord = {
      id: `cloud-deployment-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 10)}`,
      application,
      version,
      regionId,
      status: "PLANNED",
      configuration: { ...configuration },
      createdAt: now,
      updatedAt: now,
    };

    this.deployments.set(deployment.id, deployment);
    return this.clone(deployment);
  }

  deploy(id: string): CloudDeploymentRecord {
    const deployment = this.requireDeployment(id);
    deployment.status = "DEPLOYED";
    deployment.completedAt = new Date().toISOString();
    deployment.updatedAt = deployment.completedAt;
    return this.clone(deployment);
  }

  fail(id: string, error: string): CloudDeploymentRecord {
    const deployment = this.requireDeployment(id);
    deployment.status = "FAILED";
    deployment.error = error;
    deployment.updatedAt = new Date().toISOString();
    return this.clone(deployment);
  }

  rollback(id: string): CloudDeploymentRecord {
    const deployment = this.requireDeployment(id);
    deployment.status = "ROLLED_BACK";
    deployment.updatedAt = new Date().toISOString();
    return this.clone(deployment);
  }

  list(): CloudDeploymentRecord[] {
    return Array.from(this.deployments.values()).map((deployment) =>
      this.clone(deployment),
    );
  }

  count(): number {
    return this.deployments.size;
  }

  successfulCount(): number {
    return this.list().filter((deployment) => deployment.status === "DEPLOYED")
      .length;
  }

  failedCount(): number {
    return this.list().filter((deployment) => deployment.status === "FAILED")
      .length;
  }

  private requireDeployment(id: string): CloudDeploymentRecord {
    const deployment = this.deployments.get(id);

    if (!deployment) {
      throw new NotFoundException(`Cloud deployment '${id}' was not found.`);
    }

    return deployment;
  }

  private clone(deployment: CloudDeploymentRecord): CloudDeploymentRecord {
    return {
      ...deployment,
      configuration: { ...deployment.configuration },
    };
  }
}

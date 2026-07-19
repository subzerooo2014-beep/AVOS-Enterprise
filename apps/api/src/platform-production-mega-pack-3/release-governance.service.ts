import { Injectable } from "@nestjs/common";
import {
  OperationsEnvironment,
  ReleaseRecord,
} from "./platform-production-mega-pack-3.types";
import { OperationsFileStoreService } from "./operations-file-store.service";
import { DeploymentControlService } from "./deployment-control.service";

@Injectable()
export class ReleaseGovernanceService {
  constructor(
    private readonly store: OperationsFileStoreService,
    private readonly deployments: DeploymentControlService,
  ) {}

  private now(): string {
    return new Date().toISOString();
  }

  private id(prefix: string): string {
    return `${prefix}:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`;
  }

  create(input: {
    applicationKey: string;
    version: string;
    environment: OperationsEnvironment["key"];
    changeSummary: string;
    riskLevel: ReleaseRecord["riskLevel"];
  }): ReleaseRecord {
    const release: ReleaseRecord = {
      id: this.id("release"),
      applicationKey: input.applicationKey,
      version: input.version,
      environment: input.environment,
      status: "draft",
      changeSummary: input.changeSummary,
      riskLevel: input.riskLevel,
      requiredApprovals:
        input.riskLevel === "critical"
          ? 2
          : input.riskLevel === "high"
            ? 2
            : 1,
      approvals: [],
      createdAt: this.now(),
    };

    this.store.writeJson(`releases/${release.id}.json`, release);
    return release;
  }

  approve(id: string, approvedBy: string): ReleaseRecord {
    if (!approvedBy.startsWith("human:")) {
      throw new Error(
        "Release approval requires Human Final Authority.",
      );
    }

    const release = this.get(id);
    const approvals = Array.from(
      new Set([...release.approvals, approvedBy]),
    );

    const updated: ReleaseRecord = {
      ...release,
      approvals,
      status:
        approvals.length >= release.requiredApprovals
          ? "approved"
          : release.status,
    };

    this.store.writeJson(`releases/${updated.id}.json`, updated);
    return updated;
  }

  release(id: string, approvedBy: string): ReleaseRecord {
    const release = this.approve(id, approvedBy);

    if (release.status !== "approved") {
      throw new Error(
        `Release requires ${release.requiredApprovals} approvals.`,
      );
    }

    const deployment = this.deployments.deploy({
      applicationKey: release.applicationKey,
      version: release.version,
      environment: release.environment,
      strategy: "rolling",
      requestedBy: "system:release-governance",
      approvedBy,
    });

    const completed: ReleaseRecord = {
      ...release,
      status: "released",
      deploymentId: deployment.id,
      releasedAt: this.now(),
    };

    this.store.writeJson(`releases/${completed.id}.json`, completed);
    this.store.writeJson("releases/latest.json", completed);

    return completed;
  }

  list(): ReleaseRecord[] {
    return this.store.listJson<ReleaseRecord>("releases");
  }

  get(id: string): ReleaseRecord {
    const release = this.list().find((item) => item.id === id);

    if (!release) {
      throw new Error(`Release not found: ${id}`);
    }

    return release;
  }
}
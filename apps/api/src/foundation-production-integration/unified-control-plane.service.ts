import { Injectable } from "@nestjs/common";
import {
  ControlPlaneCommand,
  UnifiedHealthSnapshot,
} from "./foundation-production-integration.types";
import { FoundationProductionFileStoreService } from "./foundation-production-file-store.service";
import { FoundationIntegrationRegistryService } from "./foundation-integration-registry.service";

@Injectable()
export class UnifiedControlPlaneService {
  constructor(
    private readonly store: FoundationProductionFileStoreService,
    private readonly registry: FoundationIntegrationRegistryService,
  ) {}

  private now(): string {
    return new Date().toISOString();
  }

  private id(prefix: string): string {
    return `${prefix}:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`;
  }

  status(): Record<string, unknown> {
    const targets = this.registry.list();
    const required = targets.filter((target) => target.required);

    return {
      name: "AVOS Unified Control Plane",
      version: "FPI-UCP-1.0.0",
      status:
        required.every((target) => target.healthScore >= 90)
          ? "operational"
          : "degraded",
      registeredTargets: targets.length,
      requiredTargets: required.length,
      connectedTargets: targets.filter((target) =>
        ["connected", "certified"].includes(target.status),
      ).length,
      humanFinalAuthority: true,
      globalComplianceReadinessGate: true,
      capabilities: {
        discovery: true,
        synchronization: true,
        healthAggregation: true,
        dependencyValidation: true,
        reconciliation: true,
        certificationRegistry: true,
        productionReadiness: true,
      },
    };
  }

  execute(
    command: ControlPlaneCommand["command"],
    requestedBy: string,
    targetIds?: string[],
    approvedBy?: string,
  ): ControlPlaneCommand {
    const targets = this.registry.list();
    const selected =
      targetIds && targetIds.length > 0
        ? targets.filter((target) => targetIds.includes(target.id))
        : targets;

    const requiresHumanApproval = ["certify", "reconcile"].includes(command);

    if (
      requiresHumanApproval &&
      (!approvedBy || !approvedBy.startsWith("human:"))
    ) {
      throw new Error(
        `${command} requires Human Final Authority approval.`,
      );
    }

    const record: ControlPlaneCommand = {
      id: this.id("control-plane-command"),
      command,
      targetIds: selected.map((target) => target.id),
      requestedBy,
      requiresHumanApproval,
      approvedBy,
      status: "running",
      results: [],
      createdAt: this.now(),
    };

    for (const target of selected) {
      const dependenciesResolved = target.dependencies.every((dependencyKey) =>
        targets.some(
          (candidate) =>
            candidate.key === dependencyKey &&
            candidate.healthScore >= 90,
        ),
      );

      let success = dependenciesResolved;
      let score = dependenciesResolved ? target.healthScore : 50;
      let message = dependenciesResolved
        ? `${command} completed for ${target.name}.`
        : `Dependency validation failed for ${target.name}.`;

      if (command === "health-check") {
        score = target.healthScore;
        success = score >= 60;
        message = `Health score ${score} for ${target.name}.`;
      }

      if (command === "synchronize" && dependenciesResolved) {
        this.registry.updateHealth(
          target.id,
          Math.max(90, target.healthScore),
          target.certificationRequired ? "certified" : "connected",
        );
      }

      if (command === "reconcile" && dependenciesResolved) {
        this.registry.updateHealth(
          target.id,
          100,
          target.certificationRequired ? "certified" : "connected",
        );
        score = 100;
      }

      record.results.push({
        targetId: target.id,
        success,
        message,
        score,
      });
    }

    record.status = record.results.every((result) => result.success)
      ? "completed"
      : "failed";
    record.completedAt = this.now();

    this.store.writeJson(`control-plane-commands/${record.id}.json`, record);
    return record;
  }

  healthSnapshot(): UnifiedHealthSnapshot {
    const targets = this.registry.list();
    const requiredTargets = targets.filter((target) => target.required);

    const blockingIssues = requiredTargets
      .filter((target) => target.healthScore < 90)
      .map(
        (target) =>
          `${target.name} health score is ${target.healthScore}.`,
      );

    const overallScore =
      requiredTargets.length === 0
        ? 0
        : Math.round(
            requiredTargets.reduce(
              (sum, target) => sum + target.healthScore,
              0,
            ) / requiredTargets.length,
          );

    const snapshot: UnifiedHealthSnapshot = {
      id: this.id("unified-health"),
      overallScore,
      state:
        overallScore >= 90 && blockingIssues.length === 0
          ? "healthy"
          : overallScore >= 60
            ? "degraded"
            : "critical",
      targets: targets.map((target) => ({
        targetId: target.id,
        status: target.status,
        healthScore: target.healthScore,
        required: target.required,
      })),
      blockingIssues,
      createdAt: this.now(),
    };

    this.store.writeJson(`health-snapshots/${snapshot.id}.json`, snapshot);
    this.store.writeJson("health-snapshots/latest.json", snapshot);

    return snapshot;
  }

  listCommands(): ControlPlaneCommand[] {
    return this.store.listJson<ControlPlaneCommand>(
      "control-plane-commands",
    );
  }

  latestHealth(): UnifiedHealthSnapshot | null {
    return this.store.readJson<UnifiedHealthSnapshot | null>(
      "health-snapshots/latest.json",
      null,
    );
  }
}
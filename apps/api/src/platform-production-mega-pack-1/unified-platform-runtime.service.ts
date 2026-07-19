import { Injectable } from "@nestjs/common";
import {
  PlatformRuntimeCommand,
  PlatformRuntimeMetric,
  PlatformRuntimeHealth,
} from "./platform-production-mega-pack-1.types";
import { PlatformProductionFileStoreService } from "./platform-production-file-store.service";
import { PlatformRuntimeRegistryService } from "./platform-runtime-registry.service";

@Injectable()
export class UnifiedPlatformRuntimeService {
  constructor(
    private readonly store: PlatformProductionFileStoreService,
    private readonly registry: PlatformRuntimeRegistryService,
  ) {}

  private now(): string {
    return new Date().toISOString();
  }

  private id(prefix: string): string {
    return `${prefix}:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`;
  }

  execute(
    command: PlatformRuntimeCommand["command"],
    requestedBy: string,
    runtimeIds?: string[],
    approvedBy?: string,
  ): PlatformRuntimeCommand {
    const components = this.registry.list();
    const selected =
      runtimeIds && runtimeIds.length > 0
        ? components.filter((component) => runtimeIds.includes(component.id))
        : components;

    const requiresHumanApproval = ["stop", "restart"].includes(command);

    if (
      requiresHumanApproval &&
      (!approvedBy || !approvedBy.startsWith("human:"))
    ) {
      throw new Error(
        `${command} requires Human Final Authority approval.`,
      );
    }

    const record: PlatformRuntimeCommand = {
      id: this.id("runtime-command"),
      command,
      runtimeIds: selected.map((component) => component.id),
      requestedBy,
      requiresHumanApproval,
      approvedBy,
      status: "running",
      results: [],
      createdAt: this.now(),
    };

    for (const component of selected) {
      const dependenciesResolved = component.dependencies.every((key) =>
        components.some(
          (candidate) =>
            candidate.key === key &&
            candidate.healthScore >= 90 &&
            ["running", "certified"].includes(candidate.status),
        ),
      );

      let success = dependenciesResolved;
      let message = dependenciesResolved
        ? `${command} completed for ${component.name}.`
        : `Dependencies unresolved for ${component.name}.`;

      if (command === "bootstrap" && dependenciesResolved) {
        this.registry.setStatus(component.id, "bootstrapping");
        this.registry.setStatus(
          component.id,
          component.key === "foundation-control-plane"
            ? "certified"
            : "running",
        );
      }

      if (command === "start" && dependenciesResolved) {
        this.registry.setStatus(component.id, "running");
      }

      if (command === "stop") {
        this.registry.setStatus(component.id, "stopped");
        success = true;
      }

      if (command === "restart" && dependenciesResolved) {
        this.registry.setStatus(component.id, "stopped");
        this.registry.setStatus(component.id, "running");
      }

      if (command === "health-check") {
        success = component.healthScore >= 60;
        message = `Health score ${component.healthScore} for ${component.name}.`;
      }

      if (command === "synchronize" && dependenciesResolved) {
        this.registry.update(component.id, {
          healthScore: 100,
          lastHeartbeatAt: this.now(),
          status:
            component.key === "foundation-control-plane"
              ? "certified"
              : "running",
        });
      }

      record.results.push({
        runtimeId: component.id,
        success,
        message,
      });
    }

    record.status = record.results.every((result) => result.success)
      ? "completed"
      : "failed";
    record.completedAt = this.now();

    this.store.writeJson(`commands/${record.id}.json`, record);
    return record;
  }

  recordMetric(
    input: Omit<PlatformRuntimeMetric, "id" | "recordedAt">,
  ): PlatformRuntimeMetric {
    const metric: PlatformRuntimeMetric = {
      ...input,
      id: this.id("runtime-metric"),
      recordedAt: this.now(),
    };

    this.store.writeJson(`metrics/${metric.id}.json`, metric);
    return metric;
  }

  listMetrics(runtimeId?: string): PlatformRuntimeMetric[] {
    const metrics = this.store.listJson<PlatformRuntimeMetric>("metrics");
    return runtimeId
      ? metrics.filter((metric) => metric.runtimeId === runtimeId)
      : metrics;
  }

  health(): PlatformRuntimeHealth {
    const components = this.registry.list();
    const required = components.filter((component) => component.required);

    const blockingIssues = required
      .filter(
        (component) =>
          component.healthScore < 90 ||
          !["running", "certified"].includes(component.status),
      )
      .map(
        (component) =>
          `${component.name} is ${component.status} with score ${component.healthScore}.`,
      );

    const score =
      required.length === 0
        ? 0
        : Math.round(
            required.reduce(
              (sum, component) => sum + component.healthScore,
              0,
            ) / required.length,
          );

    const health: PlatformRuntimeHealth = {
      id: this.id("runtime-health"),
      score,
      state:
        score >= 90 && blockingIssues.length === 0
          ? "healthy"
          : score >= 60
            ? "degraded"
            : "critical",
      components: components.map((component) => ({
        runtimeId: component.id,
        healthScore: component.healthScore,
        status: component.status,
        required: component.required,
      })),
      blockingIssues,
      createdAt: this.now(),
    };

    this.store.writeJson(`health/${health.id}.json`, health);
    this.store.writeJson("health/latest.json", health);
    return health;
  }

  latestHealth(): PlatformRuntimeHealth | null {
    return this.store.readJson<PlatformRuntimeHealth | null>(
      "health/latest.json",
      null,
    );
  }

  listCommands(): PlatformRuntimeCommand[] {
    return this.store.listJson<PlatformRuntimeCommand>("commands");
  }
}
import { Injectable } from "@nestjs/common";
import { KernelPluginHealthIndex } from "../enterprise-kernel-mega-pack-6.types";
import { KernelPluginRegistryService } from "../plugins/kernel-plugin-registry.service";
import { KernelPluginCompatibilityService } from "../compatibility/kernel-plugin-compatibility.service";
import { KernelPluginPermissionService } from "../plugins/kernel-plugin-permission.service";
import { KernelPluginSandboxService } from "../sandbox/kernel-plugin-sandbox.service";
import { KernelExtensionPointRegistryService } from "../extensions/kernel-extension-point-registry.service";
import { KernelServiceRegistryService } from "../services/kernel-service-registry.service";
import { KernelPluginAuditService } from "../observability/kernel-plugin-audit.service";

@Injectable()
export class KernelPluginHealthService {
  private readonly indexes =
    new Map<string, KernelPluginHealthIndex>();

  constructor(
    private readonly plugins: KernelPluginRegistryService,
    private readonly compatibility: KernelPluginCompatibilityService,
    private readonly permissions: KernelPluginPermissionService,
    private readonly sandbox: KernelPluginSandboxService,
    private readonly extensions: KernelExtensionPointRegistryService,
    private readonly services: KernelServiceRegistryService,
    private readonly audit: KernelPluginAuditService
  ) {}

  list() {
    return Array.from(this.indexes.values());
  }

  calculate(input: {
    actorIdentityId: string;
    correlationId: string;
  }) {
    const pluginSummary = this.plugins.summary();
    const compatibilitySummary =
      this.compatibility.summary();
    const permissionSummary =
      this.permissions.summary();
    const sandboxSummary =
      this.sandbox.summary();
    const extensionSummary =
      this.extensions.summary();
    const serviceSummary =
      this.services.summary();

    const registryScore =
      pluginSummary.failed === 0
        ? 100
        : Math.max(
            0,
            100 - pluginSummary.failed * 25
          );

    const compatibilityScore =
      compatibilitySummary.total === 0
        ? 100
        : Number(
            (
              compatibilitySummary.compatible /
              compatibilitySummary.total *
              100
            ).toFixed(2)
          );

    const permissionScore =
      permissionSummary.total === 0
        ? 100
        : Number(
            (
              permissionSummary.granted /
              permissionSummary.total *
              100
            ).toFixed(2)
          );

    const sandboxScore =
      sandboxSummary.total === 0
        ? 100
        : Number(
            (
              sandboxSummary.enabled /
              sandboxSummary.total *
              100
            ).toFixed(2)
          );

    const extensionScore =
      extensionSummary.points === 0
        ? 0
        : Number(
            (
              extensionSummary.activePoints /
              extensionSummary.points *
              100
            ).toFixed(2)
          );

    const serviceScore =
      serviceSummary.total === 0
        ? 0
        : Number(
            (
              serviceSummary.active /
              serviceSummary.total *
              100
            ).toFixed(2)
          );

    const score = Number(
      (
        registryScore * 0.2 +
        compatibilityScore * 0.2 +
        permissionScore * 0.15 +
        sandboxScore * 0.15 +
        extensionScore * 0.15 +
        serviceScore * 0.15
      ).toFixed(2)
    );

    const reasons: string[] = [];

    if (registryScore < 90) {
      reasons.push(
        "Kernel plugin registry contains failed plugins."
      );
    }

    if (compatibilityScore < 90) {
      reasons.push(
        "Kernel plugin compatibility requires attention."
      );
    }

    if (permissionScore < 90) {
      reasons.push(
        "Kernel plugin permissions are incomplete."
      );
    }

    if (sandboxScore < 90) {
      reasons.push(
        "Kernel plugin sandbox coverage is incomplete."
      );
    }

    if (extensionScore < 90) {
      reasons.push(
        "Kernel extension point coverage is incomplete."
      );
    }

    if (serviceScore < 90) {
      reasons.push(
        "Kernel public service coverage is incomplete."
      );
    }

    if (reasons.length === 0) {
      reasons.push(
        "Kernel plugin, extension, and public services are healthy."
      );
    }

    const index: KernelPluginHealthIndex = {
      id: `kernel-plugin-health:${Date.now()}:${
        this.indexes.size + 1
      }`,
      score,
      level: this.level(score),
      metrics: {
        registryScore,
        compatibilityScore,
        permissionScore,
        sandboxScore,
        extensionScore,
        serviceScore
      },
      reasons,
      calculatedAt: new Date().toISOString()
    };

    this.indexes.set(index.id, index);

    this.audit.record({
      correlationId: input.correlationId,
      category: "health",
      action: "kernel-plugin-health-calculated",
      subjectId: index.id,
      actorIdentityId: input.actorIdentityId,
      outcome:
        score >= 75
          ? "success"
          : score >= 50
            ? "warning"
            : "failure",
      metadata: {
        score,
        level: index.level
      }
    });

    return index;
  }

  summary() {
    const items = this.list();

    return {
      total: items.length,
      latestScore:
        items.length === 0
          ? 0
          : items[items.length - 1]?.score ?? 0,
      healthy:
        items.filter(
          (item) =>
            item.level === "healthy" ||
            item.level === "excellent"
        ).length
    };
  }

  private level(
    score: number
  ): KernelPluginHealthIndex["level"] {
    if (score >= 90) return "excellent";
    if (score >= 75) return "healthy";
    if (score >= 60) return "stable";
    if (score >= 40) return "degraded";
    return "critical";
  }
}

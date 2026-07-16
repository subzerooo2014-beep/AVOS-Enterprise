import { Injectable } from "@nestjs/common";
import {
  KernelPluginCompatibilityAssessment
} from "../enterprise-kernel-mega-pack-6.types";
import { KernelPluginRegistryService } from "../plugins/kernel-plugin-registry.service";
import { KernelExtensionPointRegistryService } from "../extensions/kernel-extension-point-registry.service";
import { KernelPluginPermissionService } from "../plugins/kernel-plugin-permission.service";
import { KernelPluginAuditService } from "../observability/kernel-plugin-audit.service";

@Injectable()
export class KernelPluginCompatibilityService {
  private readonly assessments =
    new Map<string, KernelPluginCompatibilityAssessment>();

  private readonly kernelVersion = "1.0.0";

  constructor(
    private readonly plugins: KernelPluginRegistryService,
    private readonly extensionPoints: KernelExtensionPointRegistryService,
    private readonly permissions: KernelPluginPermissionService,
    private readonly audit: KernelPluginAuditService
  ) {}

  list() {
    return Array.from(this.assessments.values());
  }

  assess(input: {
    pluginId: string;
    actorIdentityId: string;
    correlationId: string;
  }) {
    const plugin = this.plugins.get(input.pluginId);
    const dependencyFindings: string[] = [];
    const permissionFindings: string[] = [];
    const extensionPointFindings: string[] = [];
    const warnings: string[] = [];

    const compatibleVersion = this.matchesRange(
      this.kernelVersion,
      plugin.manifest.kernelVersionRange
    );

    if (!compatibleVersion) {
      dependencyFindings.push(
        `Plugin requires kernel ${plugin.manifest.kernelVersionRange}, current ${this.kernelVersion}.`
      );
    }

    for (const dependencyId of plugin.manifest.dependencies) {
      try {
        const dependency = this.plugins.get(dependencyId);

        if (
          dependency.status !== "installed" &&
          dependency.status !== "enabled"
        ) {
          dependencyFindings.push(
            `Required plugin dependency is not installed: ${dependencyId}.`
          );
        }
      }
      catch {
        dependencyFindings.push(
          `Required plugin dependency is missing: ${dependencyId}.`
        );
      }
    }

    const grants = this.permissions.byPlugin(plugin.id);

    for (const permission of plugin.manifest.permissions) {
      const grant = grants.find(
        (item) =>
          item.permission === permission &&
          item.granted
      );

      if (!grant) {
        permissionFindings.push(
          `Plugin permission is not granted: ${permission}.`
        );
      }
    }

    for (const extensionPointId of plugin.manifest.extensionPoints) {
      try {
        const point = this.extensionPoints.get(extensionPointId);

        if (!point.active) {
          extensionPointFindings.push(
            `Extension point is inactive: ${extensionPointId}.`
          );
        }

        if (
          !point.allowedPluginTrustLevels.includes(
            plugin.manifest.trustLevel
          )
        ) {
          extensionPointFindings.push(
            `Plugin trust level is not allowed by extension point: ${extensionPointId}.`
          );
        }
      }
      catch {
        extensionPointFindings.push(
          `Extension point does not exist: ${extensionPointId}.`
        );
      }
    }

    if (
      plugin.manifest.trustLevel === "untrusted" &&
      !plugin.manifest.sandboxRequired
    ) {
      warnings.push(
        "Untrusted plugin should require sandbox execution."
      );
    }

    const compatible =
      compatibleVersion &&
      dependencyFindings.length === 0 &&
      permissionFindings.length === 0 &&
      extensionPointFindings.length === 0;

    const assessment: KernelPluginCompatibilityAssessment = {
      id: `kernel-plugin-compatibility:${Date.now()}:${
        this.assessments.size + 1
      }`,
      pluginId: plugin.id,
      compatible,
      kernelVersion: this.kernelVersion,
      pluginVersion: plugin.manifest.version,
      dependencyFindings,
      permissionFindings,
      extensionPointFindings,
      warnings,
      assessedAt: new Date().toISOString()
    };

    this.assessments.set(assessment.id, assessment);

    this.audit.record({
      correlationId: input.correlationId,
      category: "compatibility",
      action: "kernel-plugin-compatibility-assessed",
      subjectId: assessment.id,
      actorIdentityId: input.actorIdentityId,
      outcome: compatible
        ? warnings.length > 0
          ? "warning"
          : "success"
        : "blocked",
      metadata: {
        pluginId: plugin.id,
        compatible
      }
    });

    return assessment;
  }

  summary() {
    const items = this.list();

    return {
      total: items.length,
      compatible: items.filter((x) => x.compatible).length,
      incompatible: items.filter((x) => !x.compatible).length
    };
  }

  private matchesRange(version: string, range: string) {
    if (range === "*" || range === version) {
      return true;
    }

    const major = Number(version.split(".")[0] ?? "0");

    if (range.startsWith("^")) {
      return major === Number(range.slice(1).split(".")[0] ?? "0");
    }

    if (range.startsWith(">=")) {
      return this.compare(version, range.slice(2)) >= 0;
    }

    return false;
  }

  private compare(left: string, right: string) {
    const a = left.split(".").map(Number);
    const b = right.split(".").map(Number);

    for (let i = 0; i < 3; i += 1) {
      const av = a[i] ?? 0;
      const bv = b[i] ?? 0;

      if (av > bv) return 1;
      if (av < bv) return -1;
    }

    return 0;
  }
}

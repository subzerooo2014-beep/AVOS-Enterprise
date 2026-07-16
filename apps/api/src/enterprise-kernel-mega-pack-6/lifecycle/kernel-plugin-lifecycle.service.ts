import { Injectable } from "@nestjs/common";
import {
  KernelPluginLifecycleEvent,
  KernelPluginRecord,
  KernelPluginStatus
} from "../enterprise-kernel-mega-pack-6.types";
import { KernelPluginRegistryService } from "../plugins/kernel-plugin-registry.service";
import { KernelPluginCompatibilityService } from "../compatibility/kernel-plugin-compatibility.service";
import { KernelPluginSandboxService } from "../sandbox/kernel-plugin-sandbox.service";
import { KernelPluginAuditService } from "../observability/kernel-plugin-audit.service";

@Injectable()
export class KernelPluginLifecycleService {
  private readonly events: KernelPluginLifecycleEvent[] = [];

  constructor(
    private readonly registry: KernelPluginRegistryService,
    private readonly compatibility: KernelPluginCompatibilityService,
    private readonly sandbox: KernelPluginSandboxService,
    private readonly audit: KernelPluginAuditService
  ) {}

  listEvents() {
    return [...this.events];
  }

  validate(input: {
    pluginId: string;
    actorIdentityId: string;
    correlationId: string;
  }) {
    const current = this.registry.get(input.pluginId);
    const assessment = this.compatibility.assess(input);

    if (!assessment.compatible) {
      return this.transition(
        current,
        "fail",
        "failed",
        input.actorIdentityId,
        input.correlationId,
        "Plugin compatibility validation failed.",
        {
          metadata: {
            ...current.metadata,
            assessmentId: assessment.id
          }
        }
      );
    }

    return this.transition(
      current,
      "validate",
      "validated",
      input.actorIdentityId,
      input.correlationId,
      "Plugin compatibility validation passed.",
      {
        metadata: {
          ...current.metadata,
          assessmentId: assessment.id
        }
      }
    );
  }

  install(input: {
    pluginId: string;
    actorIdentityId: string;
    correlationId: string;
  }) {
    const current = this.registry.get(input.pluginId);

    if (
      current.status !== "validated" &&
      current.status !== "disabled"
    ) {
      throw new Error(
        `Kernel plugin cannot be installed from status: ${current.status}`
      );
    }

    return this.transition(
      current,
      "install",
      "installed",
      input.actorIdentityId,
      input.correlationId,
      "Plugin installed.",
      {
        installedVersion: current.manifest.version
      }
    );
  }

  enable(input: {
    pluginId: string;
    actorIdentityId: string;
    correlationId: string;
  }) {
    const current = this.registry.get(input.pluginId);

    if (
      current.status !== "installed" &&
      current.status !== "disabled"
    ) {
      throw new Error(
        `Kernel plugin cannot be enabled from status: ${current.status}`
      );
    }

    if (current.manifest.sandboxRequired) {
      const policy = this.sandbox.byPlugin(current.id);

      if (!policy?.enabled) {
        throw new Error(
          `Kernel plugin sandbox is required before enable: ${current.id}`
        );
      }
    }

    return this.transition(
      current,
      "enable",
      "enabled",
      input.actorIdentityId,
      input.correlationId,
      "Plugin enabled.",
      {
        enabledAt: new Date().toISOString()
      }
    );
  }

  disable(input: {
    pluginId: string;
    actorIdentityId: string;
    correlationId: string;
    reason: string;
  }) {
    const current = this.registry.get(input.pluginId);

    if (current.status !== "enabled") {
      throw new Error(
        `Kernel plugin cannot be disabled from status: ${current.status}`
      );
    }

    return this.transition(
      current,
      "disable",
      "disabled",
      input.actorIdentityId,
      input.correlationId,
      input.reason,
      {
        disabledAt: new Date().toISOString()
      }
    );
  }

  upgrade(input: {
    pluginId: string;
    newVersion: string;
    actorIdentityId: string;
    correlationId: string;
  }) {
    const current = this.registry.get(input.pluginId);

    if (
      current.status !== "enabled" &&
      current.status !== "disabled" &&
      current.status !== "installed"
    ) {
      throw new Error(
        `Kernel plugin cannot be upgraded from status: ${current.status}`
      );
    }

    const upgrading = this.transition(
      current,
      "upgrade",
      "upgrading",
      input.actorIdentityId,
      input.correlationId,
      `Plugin upgrade started: ${input.newVersion}.`,
      {}
    );

    const upgraded: KernelPluginRecord = {
      ...upgrading.plugin,
      manifest: {
        ...upgrading.plugin.manifest,
        version: input.newVersion
      },
      previousVersion: current.manifest.version,
      installedVersion: input.newVersion,
      status: "disabled",
      updatedAt: new Date().toISOString()
    };

    this.registry.save(upgraded);

    return {
      plugin: upgraded,
      event: upgrading.event
    };
  }

  rollback(input: {
    pluginId: string;
    actorIdentityId: string;
    correlationId: string;
  }) {
    const current = this.registry.get(input.pluginId);

    if (!current.previousVersion) {
      throw new Error(
        `Kernel plugin has no previous version for rollback: ${current.id}`
      );
    }

    const previousVersion = current.previousVersion;

    const rollingBack = this.transition(
      current,
      "rollback",
      "rollback",
      input.actorIdentityId,
      input.correlationId,
      `Plugin rollback to ${previousVersion}.`,
      {}
    );

    const rolledBack: KernelPluginRecord = {
      ...rollingBack.plugin,
      manifest: {
        ...rollingBack.plugin.manifest,
        version: previousVersion
      },
      installedVersion: previousVersion,
      previousVersion: current.manifest.version,
      status: "disabled",
      updatedAt: new Date().toISOString()
    };

    this.registry.save(rolledBack);

    return {
      plugin: rolledBack,
      event: rollingBack.event
    };
  }

  remove(input: {
    pluginId: string;
    actorIdentityId: string;
    correlationId: string;
    reason: string;
  }) {
    const current = this.registry.get(input.pluginId);

    if (!current.manifest.removable) {
      throw new Error(
        `Kernel plugin is not removable: ${current.id}`
      );
    }

    if (current.status === "enabled") {
      throw new Error(
        "Kernel plugin must be disabled before removal."
      );
    }

    const transitioned = this.transition(
      current,
      "remove",
      "removed",
      input.actorIdentityId,
      input.correlationId,
      input.reason,
      {
        removedAt: new Date().toISOString()
      }
    );

    this.registry.remove(current.id);

    return transitioned;
  }

  summary() {
    return {
      events: this.events.length,
      installs: this.events.filter((x) => x.action === "install").length,
      enables: this.events.filter((x) => x.action === "enable").length,
      upgrades: this.events.filter((x) => x.action === "upgrade").length,
      rollbacks: this.events.filter((x) => x.action === "rollback").length,
      failures: this.events.filter((x) => x.action === "fail").length
    };
  }

  private transition(
    current: KernelPluginRecord,
    action: KernelPluginLifecycleEvent["action"],
    toStatus: KernelPluginStatus,
    actorIdentityId: string,
    correlationId: string,
    reason: string,
    patch: Partial<KernelPluginRecord>
  ) {
    const updated: KernelPluginRecord = {
      ...current,
      ...patch,
      status: toStatus,
      installedAt:
        toStatus === "installed"
          ? new Date().toISOString()
          : current.installedAt,
      updatedAt: new Date().toISOString()
    };

    this.registry.save(updated);

    const event: KernelPluginLifecycleEvent = {
      id: `kernel-plugin-lifecycle:${Date.now()}:${this.events.length + 1}`,
      pluginId: current.id,
      action,
      fromStatus: current.status,
      toStatus,
      actorIdentityId,
      correlationId,
      reason,
      occurredAt: new Date().toISOString()
    };

    this.events.push(event);

    this.audit.record({
      correlationId,
      category: "lifecycle",
      action: `kernel-plugin-${action}`,
      subjectId: current.id,
      actorIdentityId,
      outcome:
        toStatus === "failed"
          ? "failure"
          : toStatus === "disabled" ||
            toStatus === "rollback"
            ? "warning"
            : "success",
      metadata: {
        fromStatus: current.status,
        toStatus
      }
    });

    return {
      plugin: updated,
      event
    };
  }
}

import {
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { KernelSandboxPolicy } from "../enterprise-kernel-mega-pack-6.types";
import { KernelPluginRegistryService } from "../plugins/kernel-plugin-registry.service";
import { KernelPluginAuditService } from "../observability/kernel-plugin-audit.service";

@Injectable()
export class KernelPluginSandboxService {
  private readonly policies =
    new Map<string, KernelSandboxPolicy>();

  constructor(
    private readonly plugins: KernelPluginRegistryService,
    private readonly audit: KernelPluginAuditService
  ) {
    this.seed();
  }

  list() {
    return Array.from(this.policies.values());
  }

  get(id: string) {
    const policy = this.policies.get(id);

    if (!policy) {
      throw new NotFoundException(
        `Kernel sandbox policy not found: ${id}`
      );
    }

    return policy;
  }

  byPlugin(pluginId: string) {
    return this.list().find(
      (policy) => policy.pluginId === pluginId
    );
  }

  configure(
    input: Omit<KernelSandboxPolicy, "createdAt" | "updatedAt">,
    context: {
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    this.plugins.get(input.pluginId);

    const existing = this.byPlugin(input.pluginId);
    const now = new Date().toISOString();

    const policy: KernelSandboxPolicy = {
      ...input,
      id:
        existing?.id ??
        input.id,
      allowedOperations:
        Array.from(new Set(input.allowedOperations)),
      deniedOperations:
        Array.from(new Set(input.deniedOperations)),
      createdAt: existing?.createdAt ?? now,
      updatedAt: now
    };

    this.policies.set(policy.id, policy);

    this.audit.record({
      correlationId: context.correlationId,
      category: "sandbox",
      action: "kernel-plugin-sandbox-configured",
      subjectId: policy.id,
      actorIdentityId: context.actorIdentityId,
      outcome: policy.enabled ? "success" : "warning",
      metadata: {
        pluginId: policy.pluginId,
        enabled: policy.enabled
      }
    });

    return policy;
  }

  execute(input: {
    pluginId: string;
    operation: string;
    payload: Record<string, unknown>;
    actorIdentityId: string;
    correlationId: string;
  }) {
    const plugin = this.plugins.get(input.pluginId);
    const policy = this.byPlugin(input.pluginId);

    if (plugin.manifest.sandboxRequired && !policy?.enabled) {
      throw new Error(
        `Kernel plugin requires sandbox but no enabled policy exists: ${plugin.id}`
      );
    }

    if (policy?.deniedOperations.includes(input.operation)) {
      throw new Error(
        `Kernel plugin operation denied by sandbox: ${input.operation}`
      );
    }

    if (
      policy &&
      policy.allowedOperations.length > 0 &&
      !policy.allowedOperations.includes(input.operation)
    ) {
      throw new Error(
        `Kernel plugin operation is not allowed by sandbox: ${input.operation}`
      );
    }

    const result = {
      pluginId: plugin.id,
      operation: input.operation,
      executed: true,
      sandboxed: policy?.enabled ?? false,
      payload: input.payload,
      executedAt: new Date().toISOString()
    };

    this.audit.record({
      correlationId: input.correlationId,
      category: "sandbox",
      action: "kernel-plugin-sandbox-executed",
      subjectId: plugin.id,
      actorIdentityId: input.actorIdentityId,
      outcome: "success",
      metadata: {
        operation: input.operation,
        sandboxed: result.sandboxed
      }
    });

    return result;
  }

  summary() {
    const policies = this.list();

    return {
      total: policies.length,
      enabled: policies.filter((x) => x.enabled).length,
      networkRestricted: policies.filter((x) => !x.networkAccess).length,
      filesystemRestricted: policies.filter((x) => !x.filesystemAccess).length
    };
  }

  private seed() {
    const now = new Date().toISOString();

    const policy: KernelSandboxPolicy = {
      id: "kernel-sandbox:official-sample",
      pluginId: "kernel-plugin:official-sample",
      enabled: true,
      allowedOperations: [
        "discover-services",
        "invoke-extension"
      ],
      deniedOperations: [
        "direct-filesystem-write",
        "direct-network-access"
      ],
      maxExecutionMilliseconds: 5000,
      maxMemoryMb: 128,
      networkAccess: false,
      filesystemAccess: false,
      metadata: {
        seeded: true
      },
      createdAt: now,
      updatedAt: now
    };

    this.policies.set(policy.id, policy);
  }
}

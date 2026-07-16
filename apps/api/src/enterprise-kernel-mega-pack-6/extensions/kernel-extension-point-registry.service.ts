import {
  ConflictException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import {
  KernelExtensionBinding,
  KernelExtensionPoint
} from "../enterprise-kernel-mega-pack-6.types";
import { KernelPluginRegistryService } from "../plugins/kernel-plugin-registry.service";
import { KernelPluginAuditService } from "../observability/kernel-plugin-audit.service";

@Injectable()
export class KernelExtensionPointRegistryService {
  private readonly points =
    new Map<string, KernelExtensionPoint>();

  private readonly bindings =
    new Map<string, KernelExtensionBinding>();

  constructor(
    private readonly audit: KernelPluginAuditService
  ) {
    this.seed();
  }

  listPoints() {
    return Array.from(this.points.values());
  }

  listBindings() {
    return Array.from(this.bindings.values());
  }

  get(id: string) {
    const point = this.points.get(id);

    if (!point) {
      throw new NotFoundException(
        `Kernel extension point not found: ${id}`
      );
    }

    return point;
  }

  registerPoint(
    input: Omit<KernelExtensionPoint, "createdAt" | "updatedAt">,
    context: {
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    if (this.points.has(input.id)) {
      throw new ConflictException(
        `Kernel extension point already exists: ${input.id}`
      );
    }

    const now = new Date().toISOString();

    const point: KernelExtensionPoint = {
      ...input,
      allowedPluginTrustLevels:
        Array.from(
          new Set(input.allowedPluginTrustLevels)
        ),
      createdAt: now,
      updatedAt: now
    };

    this.points.set(point.id, point);

    this.audit.record({
      correlationId: context.correlationId,
      category: "extension",
      action: "kernel-extension-point-registered",
      subjectId: point.id,
      actorIdentityId: context.actorIdentityId,
      outcome: "success",
      metadata: {
        type: point.type
      }
    });

    return point;
  }

  bind(
    plugin: KernelPluginRegistryService,
    input: Omit<KernelExtensionBinding, "createdAt" | "updatedAt">,
    context: {
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    const point = this.get(input.extensionPointId);
    const pluginRecord = plugin.get(input.pluginId);

    if (!point.active) {
      throw new ConflictException(
        `Kernel extension point is inactive: ${point.id}`
      );
    }

    if (
      !point.allowedPluginTrustLevels.includes(
        pluginRecord.manifest.trustLevel
      )
    ) {
      throw new ConflictException(
        `Kernel plugin trust level is not allowed: ${pluginRecord.manifest.trustLevel}`
      );
    }

    const now = new Date().toISOString();

    const binding: KernelExtensionBinding = {
      ...input,
      createdAt: now,
      updatedAt: now
    };

    this.bindings.set(binding.id, binding);

    this.audit.record({
      correlationId: context.correlationId,
      category: "extension",
      action: "kernel-plugin-extension-bound",
      subjectId: binding.id,
      actorIdentityId: context.actorIdentityId,
      outcome: "success",
      metadata: {
        pluginId: binding.pluginId,
        extensionPointId: binding.extensionPointId
      }
    });

    return binding;
  }

  byPoint(extensionPointId: string) {
    this.get(extensionPointId);

    return this.listBindings()
      .filter(
        (binding) =>
          binding.extensionPointId === extensionPointId &&
          binding.active
      )
      .sort((left, right) => right.priority - left.priority);
  }

  summary() {
    return {
      points: this.points.size,
      activePoints: this.listPoints().filter((x) => x.active).length,
      bindings: this.bindings.size,
      activeBindings: this.listBindings().filter((x) => x.active).length
    };
  }

  private seed() {
    const now = new Date().toISOString();

    const points: KernelExtensionPoint[] = [
      {
        id: "kernel-extension:runtime-hook",
        name: "Kernel Runtime Hook",
        type: "hook",
        contract: {},
        allowedPluginTrustLevels: [
          "trusted",
          "system"
        ],
        active: true,
        metadata: {
          seeded: true
        },
        createdAt: now,
        updatedAt: now
      },
      {
        id: "kernel-extension:command-handler",
        name: "Kernel Command Handler",
        type: "command-handler",
        contract: {},
        allowedPluginTrustLevels: [
          "restricted",
          "trusted",
          "system"
        ],
        active: true,
        metadata: {
          seeded: true
        },
        createdAt: now,
        updatedAt: now
      },
      {
        id: "kernel-extension:validator",
        name: "Kernel Validator",
        type: "validator",
        contract: {},
        allowedPluginTrustLevels: [
          "restricted",
          "trusted",
          "system"
        ],
        active: true,
        metadata: {
          seeded: true
        },
        createdAt: now,
        updatedAt: now
      }
    ];

    for (const point of points) {
      this.points.set(point.id, point);
    }
  }
}

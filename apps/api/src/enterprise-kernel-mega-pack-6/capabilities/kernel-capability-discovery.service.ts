import {
  ConflictException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { KernelCapabilityDescriptor } from "../enterprise-kernel-mega-pack-6.types";
import { KernelServiceRegistryService } from "../services/kernel-service-registry.service";
import { KernelExtensionPointRegistryService } from "../extensions/kernel-extension-point-registry.service";
import { KernelPluginAuditService } from "../observability/kernel-plugin-audit.service";

@Injectable()
export class KernelCapabilityDiscoveryService {
  private readonly capabilities =
    new Map<string, KernelCapabilityDescriptor>();

  constructor(
    private readonly services: KernelServiceRegistryService,
    private readonly extensionPoints: KernelExtensionPointRegistryService,
    private readonly audit: KernelPluginAuditService
  ) {
    this.seed();
  }

  list() {
    return Array.from(this.capabilities.values());
  }

  get(id: string) {
    const capability = this.capabilities.get(id);

    if (!capability) {
      throw new NotFoundException(
        `Kernel capability not found: ${id}`
      );
    }

    return capability;
  }

  register(
    input: Omit<KernelCapabilityDescriptor, "createdAt" | "updatedAt">,
    context: {
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    if (this.capabilities.has(input.id)) {
      throw new ConflictException(
        `Kernel capability already exists: ${input.id}`
      );
    }

    for (const serviceId of input.serviceIds) {
      this.services.get(serviceId);
    }

    for (const extensionPointId of input.extensionPointIds) {
      this.extensionPoints.get(extensionPointId);
    }

    const now = new Date().toISOString();

    const capability: KernelCapabilityDescriptor = {
      ...input,
      serviceIds: Array.from(new Set(input.serviceIds)),
      extensionPointIds:
        Array.from(new Set(input.extensionPointIds)),
      createdAt: now,
      updatedAt: now
    };

    this.capabilities.set(capability.id, capability);

    this.audit.record({
      correlationId: context.correlationId,
      category: "capability",
      action: "kernel-capability-registered",
      subjectId: capability.id,
      actorIdentityId: context.actorIdentityId,
      outcome: "success",
      metadata: {
        providerId: capability.providerId
      }
    });

    return capability;
  }

  discover(input?: {
    providerId?: string;
    activeOnly?: boolean;
  }) {
    return this.list().filter(
      (capability) =>
        (!input?.providerId ||
          capability.providerId === input.providerId) &&
        (!input?.activeOnly || capability.active)
    );
  }

  summary() {
    const capabilities = this.list();

    return {
      total: capabilities.length,
      active: capabilities.filter((x) => x.active).length,
      providers: new Set(
        capabilities.map((x) => x.providerId)
      ).size
    };
  }

  private seed() {
    const now = new Date().toISOString();

    const capabilities: KernelCapabilityDescriptor[] = [
      {
        id: "kernel-capability:runtime",
        name: "Kernel Runtime",
        description: "Kernel runtime public capability.",
        version: "1.0.0",
        providerId: "kernel:runtime",
        serviceIds: [
          "kernel-service:runtime"
        ],
        extensionPointIds: [
          "kernel-extension:runtime-hook"
        ],
        active: true,
        metadata: {
          seeded: true
        },
        createdAt: now,
        updatedAt: now
      },
      {
        id: "kernel-capability:plugins",
        name: "Kernel Plugins",
        description: "Plugin and extension public capability.",
        version: "1.0.0",
        providerId: "kernel:plugins",
        serviceIds: [
          "kernel-service:plugin"
        ],
        extensionPointIds: [
          "kernel-extension:command-handler",
          "kernel-extension:validator"
        ],
        active: true,
        metadata: {
          seeded: true
        },
        createdAt: now,
        updatedAt: now
      }
    ];

    for (const capability of capabilities) {
      this.capabilities.set(capability.id, capability);
    }
  }
}

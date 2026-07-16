import {
  ConflictException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { KernelServiceDescriptor } from "../enterprise-kernel-mega-pack-6.types";
import { KernelPluginAuditService } from "../observability/kernel-plugin-audit.service";

@Injectable()
export class KernelServiceRegistryService {
  private readonly services =
    new Map<string, KernelServiceDescriptor>();

  constructor(
    private readonly audit: KernelPluginAuditService
  ) {
    this.seed();
  }

  list() {
    return Array.from(this.services.values());
  }

  get(id: string) {
    const service = this.services.get(id);

    if (!service) {
      throw new NotFoundException(
        `Kernel service not found: ${id}`
      );
    }

    return service;
  }

  register(
    input: Omit<KernelServiceDescriptor, "createdAt" | "updatedAt">,
    context: {
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    if (this.services.has(input.id)) {
      throw new ConflictException(
        `Kernel service already exists: ${input.id}`
      );
    }

    const now = new Date().toISOString();

    const service: KernelServiceDescriptor = {
      ...input,
      capabilityIds:
        Array.from(new Set(input.capabilityIds)),
      methods: input.methods.map(
        (method) => ({ ...method })
      ),
      createdAt: now,
      updatedAt: now
    };

    this.services.set(service.id, service);

    this.audit.record({
      correlationId: context.correlationId,
      category: "service",
      action: "kernel-service-registered",
      subjectId: service.id,
      actorIdentityId: context.actorIdentityId,
      outcome: "success",
      metadata: {
        public: service.public,
        version: service.version
      }
    });

    return service;
  }

  discover(input?: {
    publicOnly?: boolean;
    capabilityId?: string;
  }) {
    return this.list().filter(
      (service) =>
        service.active &&
        (!input?.publicOnly || service.public) &&
        (
          !input?.capabilityId ||
          service.capabilityIds.includes(input.capabilityId)
        )
    );
  }

  invoke(input: {
    serviceId: string;
    methodName: string;
    payload: Record<string, unknown>;
    grantedPermissions: string[];
    actorIdentityId: string;
    correlationId: string;
  }) {
    const service = this.get(input.serviceId);
    const method = service.methods.find(
      (item) => item.name === input.methodName
    );

    if (!method) {
      throw new NotFoundException(
        `Kernel service method not found: ${input.methodName}`
      );
    }

    if (
      method.requiresPermission &&
      !input.grantedPermissions.includes(
        method.requiresPermission
      )
    ) {
      throw new ConflictException(
        `Kernel service permission is required: ${method.requiresPermission}`
      );
    }

    const result = {
      serviceId: service.id,
      methodName: method.name,
      success: true,
      payload: input.payload,
      invokedAt: new Date().toISOString()
    };

    this.audit.record({
      correlationId: input.correlationId,
      category: "service",
      action: "kernel-service-invoked",
      subjectId: service.id,
      actorIdentityId: input.actorIdentityId,
      outcome: "success",
      metadata: {
        methodName: method.name
      }
    });

    return result;
  }

  summary() {
    const services = this.list();

    return {
      total: services.length,
      active: services.filter((x) => x.active).length,
      public: services.filter((x) => x.public).length,
      methods: services.reduce(
        (sum, service) => sum + service.methods.length,
        0
      )
    };
  }

  private seed() {
    const now = new Date().toISOString();

    const services: KernelServiceDescriptor[] = [
      {
        id: "kernel-service:runtime",
        name: "Kernel Runtime Public Service",
        version: "1.0.0",
        providerId: "kernel:runtime",
        capabilityIds: [
          "kernel.runtime"
        ],
        public: true,
        active: true,
        methods: [
          {
            name: "status",
            description: "Read kernel runtime status."
          },
          {
            name: "readiness",
            description: "Read kernel readiness."
          }
        ],
        metadata: {
          seeded: true
        },
        createdAt: now,
        updatedAt: now
      },
      {
        id: "kernel-service:plugin",
        name: "Kernel Plugin Public Service",
        version: "1.0.0",
        providerId: "kernel:plugins",
        capabilityIds: [
          "kernel.plugins",
          "kernel.extensions"
        ],
        public: true,
        active: true,
        methods: [
          {
            name: "discover",
            description: "Discover installed plugins.",
            requiresPermission: "kernel.plugin.discover"
          },
          {
            name: "status",
            description: "Read plugin status.",
            requiresPermission: "kernel.plugin.discover"
          }
        ],
        metadata: {
          seeded: true
        },
        createdAt: now,
        updatedAt: now
      }
    ];

    for (const service of services) {
      this.services.set(service.id, service);
    }
  }
}

import { Injectable } from "@nestjs/common";
import { KernelSdkOperation } from "../enterprise-kernel-mega-pack-6.types";
import { KernelServiceRegistryService } from "../services/kernel-service-registry.service";
import { KernelPluginAuditService } from "../observability/kernel-plugin-audit.service";

@Injectable()
export class KernelSdkService {
  private readonly operations =
    new Map<string, KernelSdkOperation>();

  constructor(
    private readonly services: KernelServiceRegistryService,
    private readonly audit: KernelPluginAuditService
  ) {
    this.refresh();
  }

  refresh() {
    this.operations.clear();

    for (const service of this.services.discover({
      publicOnly: true
    })) {
      for (const method of service.methods) {
        const operation: KernelSdkOperation = {
          id: `kernel-sdk:${service.id}:${method.name}`,
          name: `${service.name}.${method.name}`,
          serviceId: service.id,
          methodName: method.name,
          requiresPermission:
            method.requiresPermission,
          available: service.active,
          metadata: {
            serviceVersion: service.version
          }
        };

        this.operations.set(
          operation.id,
          operation
        );
      }
    }

    return this.list();
  }

  list() {
    return Array.from(this.operations.values());
  }

  invoke(input: {
    operationId: string;
    payload: Record<string, unknown>;
    grantedPermissions: string[];
    actorIdentityId: string;
    correlationId: string;
  }) {
    const operation = this.operations.get(
      input.operationId
    );

    if (!operation) {
      throw new Error(
        `Kernel SDK operation not found: ${input.operationId}`
      );
    }

    const result = this.services.invoke({
      serviceId: operation.serviceId,
      methodName: operation.methodName,
      payload: input.payload,
      grantedPermissions:
        input.grantedPermissions,
      actorIdentityId:
        input.actorIdentityId,
      correlationId:
        input.correlationId
    });

    this.audit.record({
      correlationId: input.correlationId,
      category: "sdk",
      action: "kernel-sdk-operation-invoked",
      subjectId: operation.id,
      actorIdentityId:
        input.actorIdentityId,
      outcome: "success",
      metadata: {
        serviceId: operation.serviceId,
        methodName: operation.methodName
      }
    });

    return result;
  }

  summary() {
    const operations = this.list();

    return {
      total: operations.length,
      available: operations.filter((x) => x.available).length,
      permissionProtected:
        operations.filter(
          (x) => Boolean(x.requiresPermission)
        ).length
    };
  }
}

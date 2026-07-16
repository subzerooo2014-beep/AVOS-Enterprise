import {
  ConflictException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { KernelPermission } from "../enterprise-kernel-mega-pack-3.types";
import { KernelPrincipalRegistryService } from "../authorization/kernel-principal-registry.service";
import { KernelSecurityAuditService } from "../observability/kernel-security-audit.service";

@Injectable()
export class KernelPermissionRegistryService {
  private readonly permissions =
    new Map<string, KernelPermission>();

  constructor(
    private readonly principals: KernelPrincipalRegistryService,
    private readonly audit: KernelSecurityAuditService
  ) {
    this.seed();
  }

  list() {
    return Array.from(this.permissions.values());
  }

  get(id: string) {
    const permission = this.permissions.get(id);

    if (!permission) {
      throw new NotFoundException(
        `Kernel permission not found: ${id}`
      );
    }

    return permission;
  }

  register(
    input: Omit<KernelPermission, "createdAt" | "updatedAt">,
    context: {
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    this.principals.get(input.principalId);

    if (this.permissions.has(input.id)) {
      throw new ConflictException(
        `Kernel permission already exists: ${input.id}`
      );
    }

    const now = new Date().toISOString();

    const permission: KernelPermission = {
      ...input,
      conditions: input.conditions.map(
        (condition) => ({ ...condition })
      ),
      createdAt: now,
      updatedAt: now
    };

    this.permissions.set(permission.id, permission);

    this.audit.record({
      correlationId: context.correlationId,
      category: "permission",
      action: "kernel-permission-registered",
      subjectId: permission.id,
      actorIdentityId: context.actorIdentityId,
      outcome:
        permission.effect === "deny"
          ? "warning"
          : "success",
      metadata: {
        principalId: permission.principalId,
        resource: permission.resource,
        action: permission.action,
        effect: permission.effect
      }
    });

    return permission;
  }

  byPrincipal(principalId: string) {
    this.principals.get(principalId);

    return this.list()
      .filter(
        (permission) =>
          permission.principalId === principalId &&
          permission.active
      )
      .sort((left, right) => right.priority - left.priority);
  }

  summary() {
    const permissions = this.list();

    return {
      total: permissions.length,
      active: permissions.filter(
        (permission) => permission.active
      ).length,
      allow: permissions.filter(
        (permission) =>
          permission.effect === "allow"
      ).length,
      deny: permissions.filter(
        (permission) =>
          permission.effect === "deny"
      ).length
    };
  }

  private seed() {
    const now = new Date().toISOString();

    const permissions: KernelPermission[] = [
      {
        id: "kernel-permission:owner-all",
        principalId: "human:khalifa",
        resource: "kernel:*",
        action: "*",
        effect: "allow",
        conditions: [],
        priority: 1000,
        active: true,
        metadata: {
          finalAuthority: true
        },
        createdAt: now,
        updatedAt: now
      },
      {
        id: "kernel-permission:system-runtime",
        principalId: "kernel:system",
        resource: "kernel:runtime",
        action: "*",
        effect: "allow",
        conditions: [],
        priority: 900,
        active: true,
        metadata: {},
        createdAt: now,
        updatedAt: now
      },
      {
        id: "kernel-permission:runtime-execute",
        principalId: "kernel:runtime",
        resource: "kernel:execution",
        action: "execute",
        effect: "allow",
        conditions: [],
        priority: 800,
        active: true,
        metadata: {},
        createdAt: now,
        updatedAt: now
      }
    ];

    for (const permission of permissions) {
      this.permissions.set(permission.id, permission);
    }
  }
}

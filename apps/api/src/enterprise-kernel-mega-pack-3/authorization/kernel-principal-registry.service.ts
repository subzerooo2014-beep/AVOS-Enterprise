import {
  ConflictException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { KernelSecurityPrincipal } from "../enterprise-kernel-mega-pack-3.types";
import { KernelSecurityAuditService } from "../observability/kernel-security-audit.service";

@Injectable()
export class KernelPrincipalRegistryService {
  private readonly principals =
    new Map<string, KernelSecurityPrincipal>();

  constructor(
    private readonly audit: KernelSecurityAuditService
  ) {
    this.seed();
  }

  list() {
    return Array.from(this.principals.values());
  }

  get(id: string) {
    const principal = this.principals.get(id);

    if (!principal) {
      throw new NotFoundException(
        `Kernel security principal not found: ${id}`
      );
    }

    return principal;
  }

  register(
    input: Omit<KernelSecurityPrincipal, "createdAt" | "updatedAt">,
    context: {
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    if (this.principals.has(input.id)) {
      throw new ConflictException(
        `Kernel security principal already exists: ${input.id}`
      );
    }

    const now = new Date().toISOString();

    const principal: KernelSecurityPrincipal = {
      ...input,
      roles: Array.from(new Set(input.roles)),
      createdAt: now,
      updatedAt: now
    };

    this.principals.set(principal.id, principal);

    this.audit.record({
      correlationId: context.correlationId,
      category: "principal",
      action: "kernel-principal-registered",
      subjectId: principal.id,
      actorIdentityId: context.actorIdentityId,
      outcome: "success",
      metadata: {
        type: principal.type,
        roles: principal.roles
      }
    });

    return principal;
  }

  update(
    id: string,
    patch: {
      displayName?: string;
      roles?: string[];
      attributes?: Record<string, unknown>;
      active?: boolean;
    },
    context: {
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    const current = this.get(id);

    const updated: KernelSecurityPrincipal = {
      ...current,
      ...patch,
      roles:
        patch.roles === undefined
          ? current.roles
          : Array.from(new Set(patch.roles)),
      attributes: {
        ...current.attributes,
        ...(patch.attributes ?? {})
      },
      updatedAt: new Date().toISOString()
    };

    this.principals.set(id, updated);

    this.audit.record({
      correlationId: context.correlationId,
      category: "principal",
      action: "kernel-principal-updated",
      subjectId: id,
      actorIdentityId: context.actorIdentityId,
      outcome: updated.active ? "success" : "warning",
      metadata: {
        active: updated.active,
        roles: updated.roles
      }
    });

    return updated;
  }

  summary() {
    const principals = this.list();

    return {
      total: principals.length,
      active: principals.filter(
        (principal) => principal.active
      ).length,
      humans: principals.filter(
        (principal) => principal.type === "human"
      ).length,
      services: principals.filter(
        (principal) => principal.type === "service"
      ).length,
      agents: principals.filter(
        (principal) => principal.type === "agent"
      ).length,
      modules: principals.filter(
        (principal) => principal.type === "module"
      ).length
    };
  }

  private seed() {
    const now = new Date().toISOString();

    const principals: KernelSecurityPrincipal[] = [
      {
        id: "human:khalifa",
        type: "human",
        displayName: "Khalifa",
        roles: [
          "kernel-owner",
          "kernel-approver"
        ],
        attributes: {
          finalAuthority: true
        },
        active: true,
        createdAt: now,
        updatedAt: now
      },
      {
        id: "kernel:system",
        type: "system",
        displayName: "AVOS Kernel System",
        roles: ["kernel-system"],
        attributes: {},
        active: true,
        createdAt: now,
        updatedAt: now
      },
      {
        id: "kernel:runtime",
        type: "service",
        displayName: "Kernel Runtime Service",
        roles: ["kernel-runtime"],
        attributes: {},
        active: true,
        createdAt: now,
        updatedAt: now
      }
    ];

    for (const principal of principals) {
      this.principals.set(principal.id, principal);
    }
  }
}

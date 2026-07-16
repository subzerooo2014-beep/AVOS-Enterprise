import {
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { KernelPluginPermissionGrant } from "../enterprise-kernel-mega-pack-6.types";
import { KernelPluginAuditService } from "../observability/kernel-plugin-audit.service";

@Injectable()
export class KernelPluginPermissionService {
  private readonly grants =
    new Map<string, KernelPluginPermissionGrant>();

  constructor(
    private readonly audit: KernelPluginAuditService
  ) {
    this.seed();
  }

  list() {
    return Array.from(this.grants.values());
  }

  get(id: string) {
    const grant = this.grants.get(id);

    if (!grant) {
      throw new NotFoundException(
        `Kernel plugin permission grant not found: ${id}`
      );
    }

    return grant;
  }

  grant(input: {
    pluginId: string;
    permission: string;
    grantedByIdentityId: string;
    reason: string;
    correlationId: string;
  }) {
    const existing = this.list().find(
      (grant) =>
        grant.pluginId === input.pluginId &&
        grant.permission === input.permission
    );

    const now = new Date().toISOString();

    const grant: KernelPluginPermissionGrant = existing
      ? {
          ...existing,
          granted: true,
          grantedByIdentityId: input.grantedByIdentityId,
          reason: input.reason,
          updatedAt: now
        }
      : {
          id: `kernel-plugin-permission:${Date.now()}:${this.grants.size + 1}`,
          pluginId: input.pluginId,
          permission: input.permission,
          granted: true,
          grantedByIdentityId: input.grantedByIdentityId,
          reason: input.reason,
          createdAt: now,
          updatedAt: now
        };

    this.grants.set(grant.id, grant);

    this.audit.record({
      correlationId: input.correlationId,
      category: "permission",
      action: "kernel-plugin-permission-granted",
      subjectId: grant.id,
      actorIdentityId: input.grantedByIdentityId,
      outcome: "success",
      metadata: {
        pluginId: input.pluginId,
        permission: input.permission
      }
    });

    return grant;
  }

  revoke(input: {
    grantId: string;
    revokedByIdentityId: string;
    reason: string;
    correlationId: string;
  }) {
    const current = this.get(input.grantId);

    const updated: KernelPluginPermissionGrant = {
      ...current,
      granted: false,
      reason: input.reason,
      updatedAt: new Date().toISOString()
    };

    this.grants.set(updated.id, updated);

    this.audit.record({
      correlationId: input.correlationId,
      category: "permission",
      action: "kernel-plugin-permission-revoked",
      subjectId: updated.id,
      actorIdentityId: input.revokedByIdentityId,
      outcome: "warning",
      metadata: {
        pluginId: updated.pluginId,
        permission: updated.permission
      }
    });

    return updated;
  }

  byPlugin(pluginId: string) {
    return this.list().filter(
      (grant) => grant.pluginId === pluginId
    );
  }

  summary() {
    const grants = this.list();

    return {
      total: grants.length,
      granted: grants.filter((x) => x.granted).length,
      revoked: grants.filter((x) => !x.granted).length
    };
  }

  private seed() {
    const now = new Date().toISOString();

    const grants: KernelPluginPermissionGrant[] = [
      {
        id: "kernel-plugin-permission:sample-discover",
        pluginId: "kernel-plugin:official-sample",
        permission: "kernel.service.discover",
        granted: true,
        grantedByIdentityId: "human:khalifa",
        reason: "Official trusted plugin permission.",
        createdAt: now,
        updatedAt: now
      },
      {
        id: "kernel-plugin-permission:sample-bind",
        pluginId: "kernel-plugin:official-sample",
        permission: "kernel.extension.bind",
        granted: true,
        grantedByIdentityId: "human:khalifa",
        reason: "Official trusted plugin permission.",
        createdAt: now,
        updatedAt: now
      }
    ];

    for (const grant of grants) {
      this.grants.set(grant.id, grant);
    }
  }
}

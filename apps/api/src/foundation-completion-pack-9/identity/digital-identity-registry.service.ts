import {
  Injectable,
  NotFoundException
} from "@nestjs/common";
import {
  DigitalIdentity,
  DigitalIdentityStatus,
  DigitalIdentityType
} from "../foundation-pack-9.types";
import { Foundation9AuditService } from "../observability/foundation-9-audit.service";

@Injectable()
export class DigitalIdentityRegistryService {
  private readonly identities =
    new Map<string, DigitalIdentity>();

  constructor(
    private readonly audit: Foundation9AuditService
  ) {}

  list() {
    return Array.from(this.identities.values());
  }

  get(id: string) {
    const identity = this.identities.get(id);

    if (!identity) {
      throw new NotFoundException(
        `Digital identity not found: ${id}`
      );
    }

    return identity;
  }

  register(input: {
    id?: string;
    canonicalName: string;
    displayName: string;
    type: DigitalIdentityType;
    ownerIdentityId?: string;
    organizationIdentityId?: string;
    aliases?: string[];
    permissions?: string[];
    attributes?: Record<string, unknown>;
    correlationId: string;
    actorIdentityId: string;
  }) {
    const id =
      input.id ??
      `identity:${input.type}:${this.slug(input.canonicalName)}`;

    const now = new Date().toISOString();

    const identity: DigitalIdentity = {
      id,
      canonicalName: input.canonicalName.trim(),
      displayName: input.displayName.trim(),
      type: input.type,
      status: "active",
      ownerIdentityId: input.ownerIdentityId,
      organizationIdentityId: input.organizationIdentityId,
      aliases: Array.from(new Set(input.aliases ?? [])),
      permissions: Array.from(new Set(input.permissions ?? [])),
      attributes: input.attributes ?? {},
      createdAt: now,
      updatedAt: now
    };

    this.identities.set(identity.id, identity);

    this.audit.record({
      correlationId: input.correlationId,
      category: "identity",
      action: "identity-registered",
      subjectId: identity.id,
      actorIdentityId: input.actorIdentityId,
      outcome: "success",
      metadata: {
        type: identity.type,
        canonicalName: identity.canonicalName
      }
    });

    return identity;
  }

  updateStatus(
    id: string,
    status: DigitalIdentityStatus,
    input: {
      correlationId: string;
      actorIdentityId: string;
    }
  ) {
    const current = this.get(id);

    const updated: DigitalIdentity = {
      ...current,
      status,
      updatedAt: new Date().toISOString()
    };

    this.identities.set(id, updated);

    this.audit.record({
      correlationId: input.correlationId,
      category: "identity",
      action: `identity-status:${status}`,
      subjectId: id,
      actorIdentityId: input.actorIdentityId,
      outcome: "success",
      metadata: {}
    });

    return updated;
  }

  resolve(nameOrAlias: string) {
    const normalized = nameOrAlias.trim().toLowerCase();

    return this.list().find(
      (identity) =>
        identity.id.toLowerCase() === normalized ||
        identity.canonicalName.toLowerCase() === normalized ||
        identity.aliases.some(
          (alias) => alias.toLowerCase() === normalized
        )
    );
  }

  summary() {
    const identities = this.list();

    return {
      total: identities.length,
      active: identities.filter(
        (identity) => identity.status === "active"
      ).length,
      agents: identities.filter(
        (identity) => identity.type === "agent"
      ).length,
      capabilities: identities.filter(
        (identity) => identity.type === "capability"
      ).length,
      organizations: identities.filter(
        (identity) => identity.type === "organization"
      ).length
    };
  }

  private slug(value: string) {
    return value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }
}

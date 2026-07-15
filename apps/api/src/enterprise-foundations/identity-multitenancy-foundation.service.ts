import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { IdentityContext } from "./enterprise-foundations.types";

@Injectable()
export class IdentityMultitenancyFoundationService {
  private readonly identities = new Map<string, IdentityContext>();

  register(
    input: Omit<IdentityContext, "id" | "createdAt" | "updatedAt">,
  ): IdentityContext {
    const now = new Date().toISOString();

    const identity: IdentityContext = {
      ...input,
      id: randomUUID(),
      roles: [...input.roles],
      attributes: { ...input.attributes },
      createdAt: now,
      updatedAt: now,
    };

    this.identities.set(identity.id, identity);
    return this.clone(identity);
  }

  authorize(
    identityId: string,
    tenantId: string,
    requiredRole?: string,
    requiredAttributes?: Record<string, string>,
  ) {
    const identity = this.requireIdentity(identityId);

    const tenantAllowed = identity.tenantId === tenantId;
    const roleAllowed =
      !requiredRole || identity.roles.includes(requiredRole);
    const attributesAllowed = Object.entries(
      requiredAttributes ?? {},
    ).every(
      ([key, value]) => identity.attributes[key] === value,
    );

    return {
      identityId,
      tenantId,
      allowed:
        tenantAllowed &&
        roleAllowed &&
        attributesAllowed &&
        identity.mfaVerified &&
        identity.consentGranted,
      tenantAllowed,
      roleAllowed,
      attributesAllowed,
      mfaVerified: identity.mfaVerified,
      consentGranted: identity.consentGranted,
      evaluatedAt: new Date().toISOString(),
    };
  }

  dashboard() {
    const identities = Array.from(this.identities.values());

    return {
      identities: identities.length,
      users: identities.filter((item) => item.subjectType === "USER").length,
      services: identities.filter(
        (item) => item.subjectType === "SERVICE",
      ).length,
      machines: identities.filter(
        (item) => item.subjectType === "MACHINE",
      ).length,
      mfaVerified: identities.filter((item) => item.mfaVerified).length,
      consentGranted: identities.filter(
        (item) => item.consentGranted,
      ).length,
      tenants: new Set(identities.map((item) => item.tenantId)).size,
      generatedAt: new Date().toISOString(),
    };
  }

  private requireIdentity(id: string): IdentityContext {
    const identity = this.identities.get(id);

    if (!identity) {
      throw new Error(`Identity not found: ${id}`);
    }

    return identity;
  }

  private clone(identity: IdentityContext): IdentityContext {
    return {
      ...identity,
      roles: [...identity.roles],
      attributes: { ...identity.attributes },
    };
  }
}
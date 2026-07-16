import { Injectable, NotFoundException } from "@nestjs/common";
import type { FoundationIdentityV1 } from "./foundation-control-automation-v1.types";

@Injectable()
export class FoundationIamV1Service {
  private readonly identities = new Map<string, FoundationIdentityV1>();

  upsert(
    input: Omit<FoundationIdentityV1, "createdAt" | "updatedAt">,
  ): FoundationIdentityV1 {
    const existing = this.identities.get(input.id);
    const now = new Date().toISOString();

    const identity: FoundationIdentityV1 = {
      ...input,
      roles: [...input.roles],
      attributes: { ...input.attributes },
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };

    this.identities.set(identity.id, identity);
    return this.clone(identity);
  }

  authorize(
    id: string,
    requiredRole?: string,
    requiredAttributes: Record<string, unknown> = {},
  ): boolean {
    const identity = this.requireIdentity(id);

    if (!identity.active) return false;
    if (requiredRole && !identity.roles.includes(requiredRole)) return false;

    return Object.entries(requiredAttributes).every(
      ([key, value]) => identity.attributes[key] === value,
    );
  }

  list(): FoundationIdentityV1[] {
    return Array.from(this.identities.values()).map((identity) => this.clone(identity));
  }

  count(): number {
    return this.identities.size;
  }

  private requireIdentity(id: string): FoundationIdentityV1 {
    const identity = this.identities.get(id);
    if (!identity) {
      throw new NotFoundException(`Foundation identity '${id}' was not found.`);
    }
    return identity;
  }

  private clone(identity: FoundationIdentityV1): FoundationIdentityV1 {
    return {
      ...identity,
      roles: [...identity.roles],
      attributes: { ...identity.attributes },
    };
  }
}

import { Injectable, NotFoundException } from "@nestjs/common";
import type { IdentityRecord } from "./zero-trust-security.types";

@Injectable()
export class IdentityRegistryService {
  private readonly identities = new Map<string, IdentityRecord>();

  register(
    input: Omit<IdentityRecord, "createdAt" | "updatedAt">,
  ): IdentityRecord {
    const existing = this.identities.get(input.id);
    const now = new Date().toISOString();
    const identity: IdentityRecord = {
      ...input,
      attributes: { ...input.attributes },
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };
    this.identities.set(identity.id, identity);
    return this.clone(identity);
  }

  get(id: string): IdentityRecord {
    const identity = this.identities.get(id);
    if (!identity) throw new NotFoundException(`Identity '${id}' was not found.`);
    return this.clone(identity);
  }

  list(): IdentityRecord[] {
    return Array.from(this.identities.values()).map((item) => this.clone(item));
  }

  count(): number {
    return this.identities.size;
  }

  private clone(item: IdentityRecord): IdentityRecord {
    return { ...item, attributes: { ...item.attributes } };
  }
}

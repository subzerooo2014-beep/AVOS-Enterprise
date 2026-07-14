import { Injectable, NotFoundException } from "@nestjs/common";
import { PartnerCredential } from "./super-app-v5.types";

@Injectable()
export class SuperAppV5RegistryService {
  private readonly credentials = new Map<string, PartnerCredential>();

  register(input: {
    partnerId: string;
    keyId: string;
    secret: string;
  }): PartnerCredential {
    const now = new Date().toISOString();
    const credential: PartnerCredential = {
      id: `cred_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      partnerId: input.partnerId,
      keyId: input.keyId,
      secretMasked: this.mask(input.secret),
      active: true,
      createdAt: now,
    };

    this.credentials.set(credential.id, credential);
    return credential;
  }

  list(): PartnerCredential[] {
    return [...this.credentials.values()];
  }

  get(id: string): PartnerCredential {
    const credential = this.credentials.get(id);
    if (!credential) {
      throw new NotFoundException(`Credential ${id} not found`);
    }
    return credential;
  }

  rotate(id: string, secret: string): PartnerCredential {
    const credential = this.get(id);
    credential.secretMasked = this.mask(secret);
    credential.rotatedAt = new Date().toISOString();
    credential.active = true;
    return credential;
  }

  deactivate(id: string): PartnerCredential {
    const credential = this.get(id);
    credential.active = false;
    return credential;
  }

  private mask(secret: string): string {
    if (secret.length <= 4) return "****";
    return `${"*".repeat(Math.max(4, secret.length - 4))}${secret.slice(-4)}`;
  }
}

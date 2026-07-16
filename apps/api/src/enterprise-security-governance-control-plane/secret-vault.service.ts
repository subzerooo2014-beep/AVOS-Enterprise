import { Injectable } from "@nestjs/common";
import type { SecretRecord } from "./enterprise-security-governance-control-plane.types";

@Injectable()
export class SecretVaultService {
  private readonly secrets = new Map<string, SecretRecord>();

  set(key: string, value: string): SecretRecord {
    const existing = this.secrets.get(key);
    const secret: SecretRecord = {
      key,
      value,
      version: (existing?.version ?? 0) + 1,
      updatedAt: new Date().toISOString(),
    };

    this.secrets.set(key, secret);
    return { ...secret, value: "***" };
  }

  get(key: string): string | undefined {
    return this.secrets.get(key)?.value;
  }

  listMetadata(): Omit<SecretRecord, "value">[] {
    return Array.from(this.secrets.values()).map(({ value: _value, ...metadata }) => ({
      ...metadata,
    }));
  }

  count(): number {
    return this.secrets.size;
  }
}

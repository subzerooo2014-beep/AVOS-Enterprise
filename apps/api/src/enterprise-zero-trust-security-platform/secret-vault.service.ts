import { Injectable } from "@nestjs/common";
import type { SecretRecord } from "./zero-trust-security.types";

@Injectable()
export class SecretVaultService {
  private readonly secrets = new Map<string, SecretRecord>();

  set(key: string, value: string): Omit<SecretRecord, "value"> {
    const existing = this.secrets.get(key);
    const record: SecretRecord = {
      key,
      value,
      version: (existing?.version ?? 0) + 1,
      updatedAt: new Date().toISOString(),
    };

    this.secrets.set(key, record);

    return {
      key: record.key,
      version: record.version,
      updatedAt: record.updatedAt,
    };
  }

  get(key: string): string | undefined {
    return this.secrets.get(key)?.value;
  }

  metadata(): Omit<SecretRecord, "value">[] {
    return Array.from(this.secrets.values()).map((record) => ({
      key: record.key,
      version: record.version,
      updatedAt: record.updatedAt,
    }));
  }

  count(): number {
    return this.secrets.size;
  }
}

import { Injectable } from "@nestjs/common";
import { createHash } from "crypto";
import type { FoundationSecretV1 } from "./foundation-control-automation-v1.types";

@Injectable()
export class FoundationSecretsV1Service {
  private readonly secrets = new Map<string, FoundationSecretV1>();

  store(key: string, plainValue: string): FoundationSecretV1 {
    const existing = this.secrets.get(key);

    const secret: FoundationSecretV1 = {
      key,
      encryptedValue: createHash("sha256").update(plainValue).digest("hex"),
      version: (existing?.version ?? 0) + 1,
      rotatedAt: new Date().toISOString(),
    };

    this.secrets.set(key, secret);
    return { ...secret };
  }

  exists(key: string): boolean {
    return this.secrets.has(key);
  }

  listMetadata(): Array<Omit<FoundationSecretV1, "encryptedValue">> {
    return Array.from(this.secrets.values()).map((secret) => ({
      key: secret.key,
      version: secret.version,
      rotatedAt: secret.rotatedAt,
    }));
  }

  count(): number {
    return this.secrets.size;
  }
}

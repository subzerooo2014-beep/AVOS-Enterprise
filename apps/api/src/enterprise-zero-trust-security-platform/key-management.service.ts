import { Injectable, NotFoundException } from "@nestjs/common";
import { randomBytes } from "crypto";
import type { KeyRecord } from "./zero-trust-security.types";

@Injectable()
export class KeyManagementService {
  private readonly keys = new Map<string, KeyRecord>();

  generate(id: string, algorithm = "AES-256-GCM"): Omit<KeyRecord, "material"> {
    const existing = this.keys.get(id);
    const key: KeyRecord = {
      id,
      algorithm,
      version: (existing?.version ?? 0) + 1,
      status: "ACTIVE",
      material: randomBytes(32).toString("hex"),
      createdAt: new Date().toISOString(),
    };

    this.keys.set(id, key);
    return this.metadata(key);
  }

  material(id: string): string {
    const key = this.keys.get(id);
    if (!key) throw new NotFoundException(`Key '${id}' was not found.`);
    return key.material;
  }

  retire(id: string): Omit<KeyRecord, "material"> {
    const key = this.keys.get(id);
    if (!key) throw new NotFoundException(`Key '${id}' was not found.`);
    key.status = "RETIRED";
    return this.metadata(key);
  }

  list(): Omit<KeyRecord, "material">[] {
    return Array.from(this.keys.values()).map((item) => this.metadata(item));
  }

  count(): number {
    return this.keys.size;
  }

  private metadata(item: KeyRecord): Omit<KeyRecord, "material"> {
    return {
      id: item.id,
      algorithm: item.algorithm,
      version: item.version,
      status: item.status,
      createdAt: item.createdAt,
    };
  }
}

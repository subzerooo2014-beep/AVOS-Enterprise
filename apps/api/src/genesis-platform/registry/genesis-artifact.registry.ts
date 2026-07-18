import { Injectable } from "@nestjs/common";
import { GenesisArtifactRecord } from "../types/genesis-platform.types";

@Injectable()
export class GenesisArtifactRegistry {
  private readonly artifacts = new Map<string, GenesisArtifactRecord>();

  register(record: GenesisArtifactRecord): GenesisArtifactRecord {
    this.artifacts.set(record.id, structuredClone(record));
    return structuredClone(record);
  }

  update(
    id: string,
    patch: Partial<GenesisArtifactRecord>,
  ): GenesisArtifactRecord | undefined {
    const current = this.artifacts.get(id);
    if (!current) return undefined;

    const updated = { ...current, ...patch };
    this.artifacts.set(id, updated);
    return structuredClone(updated);
  }

  get(id: string): GenesisArtifactRecord | undefined {
    const value = this.artifacts.get(id);
    return value ? structuredClone(value) : undefined;
  }

  list(): GenesisArtifactRecord[] {
    return [...this.artifacts.values()].map((item) => structuredClone(item));
  }

  count(): number {
    return this.artifacts.size;
  }
}

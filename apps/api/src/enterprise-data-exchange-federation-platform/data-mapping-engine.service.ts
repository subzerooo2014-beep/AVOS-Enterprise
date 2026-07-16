import { Injectable, NotFoundException } from "@nestjs/common";
import { SchemaRegistryService } from "./schema-registry.service";
import type { DataMappingRecord } from "./enterprise-data-exchange-federation.types";

@Injectable()
export class DataMappingEngineService {
  private readonly mappings = new Map<string, DataMappingRecord>();

  constructor(private readonly schemas: SchemaRegistryService) {}

  register(
    input: Omit<DataMappingRecord, "version" | "createdAt">,
  ): DataMappingRecord {
    this.schemas.get(input.sourceSchemaId);
    this.schemas.get(input.targetSchemaId);

    const existing = this.mappings.get(input.id);

    const mapping: DataMappingRecord = {
      ...input,
      mappings: { ...input.mappings },
      version: (existing?.version ?? 0) + 1,
      createdAt: existing?.createdAt ?? new Date().toISOString(),
    };

    this.mappings.set(mapping.id, mapping);
    return this.clone(mapping);
  }

  transform(
    id: string,
    payload: Record<string, unknown>,
  ): Record<string, unknown> {
    const mapping = this.mappings.get(id);

    if (!mapping) {
      throw new NotFoundException(`Data mapping '${id}' was not found.`);
    }

    const transformed: Record<string, unknown> = {};

    for (const [sourceField, targetField] of Object.entries(mapping.mappings)) {
      transformed[targetField] = payload[sourceField];
    }

    return transformed;
  }

  list(): DataMappingRecord[] {
    return Array.from(this.mappings.values()).map((mapping) =>
      this.clone(mapping),
    );
  }

  count(): number {
    return this.mappings.size;
  }

  private clone(mapping: DataMappingRecord): DataMappingRecord {
    return {
      ...mapping,
      mappings: { ...mapping.mappings },
    };
  }
}

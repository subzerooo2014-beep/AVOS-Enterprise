import { Injectable, NotFoundException } from "@nestjs/common";
import type { SchemaDefinitionRecord } from "./enterprise-data-exchange-federation.types";

@Injectable()
export class SchemaRegistryService {
  private readonly schemas = new Map<string, SchemaDefinitionRecord>();

  register(
    input: Omit<SchemaDefinitionRecord, "version" | "createdAt" | "updatedAt">,
  ): SchemaDefinitionRecord {
    const existing = this.schemas.get(input.id);
    const now = new Date().toISOString();

    const schema: SchemaDefinitionRecord = {
      ...input,
      definition: { ...input.definition },
      version: (existing?.version ?? 0) + 1,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };

    this.schemas.set(schema.id, schema);
    return this.clone(schema);
  }

  get(id: string): SchemaDefinitionRecord {
    const schema = this.schemas.get(id);

    if (!schema) {
      throw new NotFoundException(`Schema '${id}' was not found.`);
    }

    return this.clone(schema);
  }

  list(): SchemaDefinitionRecord[] {
    return Array.from(this.schemas.values()).map((schema) =>
      this.clone(schema),
    );
  }

  count(): number {
    return this.schemas.size;
  }

  private clone(schema: SchemaDefinitionRecord): SchemaDefinitionRecord {
    return {
      ...schema,
      definition: { ...schema.definition },
    };
  }
}

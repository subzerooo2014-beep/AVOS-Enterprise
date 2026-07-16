import { Injectable, NotFoundException } from "@nestjs/common";
import type { KnowledgeGraphEntityV2 } from "./enterprise-knowledge-graph-platform-v2.types";

@Injectable()
export class KnowledgeEntityRegistryV2Service {
  private readonly entities = new Map<string, KnowledgeGraphEntityV2>();

  upsert(
    input: Omit<KnowledgeGraphEntityV2, "version" | "createdAt" | "updatedAt">,
  ): KnowledgeGraphEntityV2 {
    const existing = this.entities.get(input.id);
    const now = new Date().toISOString();

    const entity: KnowledgeGraphEntityV2 = {
      ...input,
      properties: { ...input.properties },
      tags: [...input.tags],
      version: (existing?.version ?? 0) + 1,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };

    this.entities.set(entity.id, entity);
    return this.clone(entity);
  }

  get(id: string): KnowledgeGraphEntityV2 {
    const entity = this.entities.get(id);
    if (!entity) {
      throw new NotFoundException(`Knowledge entity '${id}' was not found.`);
    }
    return this.clone(entity);
  }

  list(): KnowledgeGraphEntityV2[] {
    return Array.from(this.entities.values()).map((entity) => this.clone(entity));
  }

  count(): number {
    return this.entities.size;
  }

  private clone(entity: KnowledgeGraphEntityV2): KnowledgeGraphEntityV2 {
    return {
      ...entity,
      properties: { ...entity.properties },
      tags: [...entity.tags],
    };
  }
}

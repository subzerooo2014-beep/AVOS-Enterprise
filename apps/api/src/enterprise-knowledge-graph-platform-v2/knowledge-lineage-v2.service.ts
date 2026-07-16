import { Injectable } from "@nestjs/common";
import type { KnowledgeGraphLineageV2 } from "./enterprise-knowledge-graph-platform-v2.types";

@Injectable()
export class KnowledgeLineageV2Service {
  private readonly records: KnowledgeGraphLineageV2[] = [];

  record(
    entityId: string,
    source: string,
    operation: string,
    currentVersion: number,
    previousVersion?: number,
  ): KnowledgeGraphLineageV2 {
    const record: KnowledgeGraphLineageV2 = {
      id: `kg-lineage-v2-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      entityId,
      source,
      operation,
      previousVersion,
      currentVersion,
      createdAt: new Date().toISOString(),
    };

    this.records.unshift(record);
    return { ...record };
  }

  list(entityId?: string): KnowledgeGraphLineageV2[] {
    return this.records
      .filter((record) => (entityId ? record.entityId === entityId : true))
      .map((record) => ({ ...record }));
  }

  count(): number {
    return this.records.length;
  }
}

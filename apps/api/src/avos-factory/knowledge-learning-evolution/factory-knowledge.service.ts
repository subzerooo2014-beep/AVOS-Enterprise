import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import {
  FactoryKnowledgeRecord,
  FactoryKnowledgeType,
} from "./factory-knowledge.contracts";

@Injectable()
export class FactoryKnowledgeService {
  private readonly records = new Map<string, FactoryKnowledgeRecord>();

  capture(input: {
    type: FactoryKnowledgeType;
    sourceId: string;
    title: string;
    summary: string;
    tags?: string[];
    trustScore?: number;
  }): FactoryKnowledgeRecord {
    const now = new Date().toISOString();
    const record: FactoryKnowledgeRecord = {
      id: randomUUID(),
      type: input.type,
      sourceId: input.sourceId,
      title: input.title,
      summary: input.summary,
      tags: input.tags ?? [],
      trustScore: Math.max(0, Math.min(100, input.trustScore ?? 90)),
      version: 1,
      createdAt: now,
      updatedAt: now,
    };

    this.records.set(record.id, record);
    return structuredClone(record);
  }

  all(): FactoryKnowledgeRecord[] {
    return structuredClone([...this.records.values()]);
  }

  findBySource(sourceId: string): FactoryKnowledgeRecord[] {
    return this.all().filter((record) => record.sourceId === sourceId);
  }

  count(): number {
    return this.records.size;
  }
}

import { Injectable } from "@nestjs/common";
import { createHash } from "node:crypto";
import { KnowledgeChangeType, KnowledgeVersionRecord } from "./knowledge-evolution.types";

@Injectable()
export class KnowledgeVersionStoreService {
  private readonly versions = new Map<string, KnowledgeVersionRecord[]>();

  record(input: { knowledgeId: string; version: number; previousVersion?: number; changeType: KnowledgeChangeType; changedBy: string; payload?: unknown; metadata?: Record<string, unknown> }): KnowledgeVersionRecord {
    const record: KnowledgeVersionRecord = {
      knowledgeId: input.knowledgeId,
      version: input.version,
      previousVersion: input.previousVersion,
      checksum: createHash("sha256").update(JSON.stringify(input.payload ?? {})).digest("hex"),
      changeType: input.changeType,
      changedBy: input.changedBy,
      changedAt: new Date().toISOString(),
      metadata: input.metadata,
    };
    const current = this.versions.get(input.knowledgeId) ?? [];
    current.push(record);
    this.versions.set(input.knowledgeId, current);
    return record;
  }

  latest(knowledgeId: string): KnowledgeVersionRecord | undefined {
    const list = this.versions.get(knowledgeId) ?? [];
    return list.length ? list[list.length - 1] : undefined;
  }

  history(knowledgeId: string): KnowledgeVersionRecord[] {
    return [...(this.versions.get(knowledgeId) ?? [])];
  }

  count(): number {
    return [...this.versions.values()].reduce((sum, list) => sum + list.length, 0);
  }
}
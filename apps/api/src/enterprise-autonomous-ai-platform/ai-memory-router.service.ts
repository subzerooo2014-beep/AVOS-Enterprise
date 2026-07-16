import { Injectable } from "@nestjs/common";
import type { AiMemoryRecord } from "./enterprise-autonomous-ai.types";

@Injectable()
export class AiMemoryRouterService {
  private readonly memories = new Map<string, AiMemoryRecord>();

  set(scope: string, key: string, value: unknown): AiMemoryRecord {
    const id = `${scope}:${key}`;
    const existing = this.memories.get(id);
    const record: AiMemoryRecord = {
      id,
      scope,
      key,
      value,
      version: (existing?.version ?? 0) + 1,
      updatedAt: new Date().toISOString(),
    };

    this.memories.set(id, record);
    return { ...record };
  }

  get(scope: string, key: string): AiMemoryRecord | undefined {
    const record = this.memories.get(`${scope}:${key}`);
    return record ? { ...record } : undefined;
  }

  list(scope?: string): AiMemoryRecord[] {
    return Array.from(this.memories.values())
      .filter((item) => (scope ? item.scope === scope : true))
      .map((item) => ({ ...item }));
  }

  count(): number {
    return this.memories.size;
  }
}

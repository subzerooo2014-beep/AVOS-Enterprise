import { Injectable } from "@nestjs/common";
import type { FoundationMemoryRecordV1 } from "./foundation-governance-security-intelligence-v1.types";

@Injectable()
export class FoundationEnterpriseMemoryV1Service {
  private readonly memories = new Map<string, FoundationMemoryRecordV1>();

  remember(
    namespace: string,
    key: string,
    value: Record<string, unknown>,
    tags: string[] = [],
  ): FoundationMemoryRecordV1 {
    const id = `${namespace}:${key}`;
    const existing = this.memories.get(id);
    const now = new Date().toISOString();

    const memory: FoundationMemoryRecordV1 = {
      id,
      namespace,
      key,
      value: { ...value },
      tags: [...tags],
      version: (existing?.version ?? 0) + 1,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };

    this.memories.set(memory.id, memory);
    return this.clone(memory);
  }

  recall(namespace: string, key: string): FoundationMemoryRecordV1 | undefined {
    const memory = this.memories.get(`${namespace}:${key}`);
    return memory ? this.clone(memory) : undefined;
  }

  list(): FoundationMemoryRecordV1[] {
    return Array.from(this.memories.values()).map((item) => this.clone(item));
  }

  count(): number {
    return this.memories.size;
  }

  private clone(item: FoundationMemoryRecordV1): FoundationMemoryRecordV1 {
    return {
      ...item,
      value: { ...item.value },
      tags: [...item.tags],
    };
  }
}

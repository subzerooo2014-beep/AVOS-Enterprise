import { Injectable } from "@nestjs/common";
import { MemoryPolicy } from "../policies/memory.policy";
import { MemoryRecord } from "../enterprise-ai-os.types";
import { aiOsId } from "../enterprise-ai-os.utils";
@Injectable()
export class MemoryStoreService {
  private readonly records: MemoryRecord[] = [];
  constructor(private readonly policy: MemoryPolicy) {}
  store(input: {
    namespace: string;
    key: string;
    value: Record<string, unknown>;
    importance?: number;
  }) {
    const importance = input.importance ?? 50;
    this.policy.validate(input.namespace, input.key, importance);
    const now = new Date().toISOString();
    const existing = this.records.find(
      (item) =>
        item.namespace === input.namespace &&
        item.key === input.key,
    );
    if (existing) {
      existing.value = input.value;
      existing.importance = importance;
      existing.updatedAt = now;
      return existing;
    }
    const record: MemoryRecord = {
      id: aiOsId("memory"),
      ...input,
      importance,
      createdAt: now,
      updatedAt: now,
    };
    this.records.push(record);
    return record;
  }
  recall(namespace: string, key?: string, minImportance = 0) {
    return this.records.filter(
      (item) =>
        item.namespace === namespace &&
        (!key || item.key === key) &&
        item.importance >= minImportance,
    );
  }
}

import { Injectable } from '@nestjs/common';
import { nowIso } from '../shared/runtime.utils';

export interface RuntimeMemoryRecord {
  namespace: string;
  key: string;
  value: unknown;
  version: number;
  updatedAt: string;
}

@Injectable()
export class RuntimeMemoryService {
  private readonly records = new Map<string, RuntimeMemoryRecord>();

  set(
    namespace: string,
    key: string,
    value: unknown,
  ): RuntimeMemoryRecord {
    const id = `${namespace}:${key}`;
    const current = this.records.get(id);

    const record: RuntimeMemoryRecord = {
      namespace,
      key,
      value: structuredClone(value),
      version: (current?.version ?? 0) + 1,
      updatedAt: nowIso(),
    };

    this.records.set(id, record);
    return structuredClone(record);
  }

  get(namespace: string, key: string): RuntimeMemoryRecord | undefined {
    const record = this.records.get(`${namespace}:${key}`);
    return record ? structuredClone(record) : undefined;
  }

  list(namespace?: string): RuntimeMemoryRecord[] {
    return [...this.records.values()]
      .filter((record) => !namespace || record.namespace === namespace)
      .map((record) => structuredClone(record));
  }

  count(): number {
    return this.records.size;
  }
}
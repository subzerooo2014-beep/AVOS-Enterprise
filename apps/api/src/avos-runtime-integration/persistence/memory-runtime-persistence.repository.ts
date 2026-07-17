import { Injectable } from '@nestjs/common';
import { PersistentRuntimeRecord } from '../contracts/integration.contracts';
import { RuntimePersistenceRepository } from './runtime-persistence.repository';
import { deepCopy, integrationNow } from '../shared/integration.utils';

@Injectable()
export class MemoryRuntimePersistenceRepository
  implements RuntimePersistenceRepository
{
  private readonly records = new Map<string, PersistentRuntimeRecord>();

  async upsert(
    input: Omit<PersistentRuntimeRecord, 'createdAt' | 'updatedAt'>,
  ): Promise<PersistentRuntimeRecord> {
    const mapKey = `${input.namespace}:${input.key}`;
    const current = this.records.get(mapKey);
    const timestamp = integrationNow();

    const record: PersistentRuntimeRecord = {
      ...input,
      createdAt: current?.createdAt ?? timestamp,
      updatedAt: timestamp,
      payload: deepCopy(input.payload),
    };

    this.records.set(mapKey, record);
    return deepCopy(record);
  }

  async find(
    namespace: string,
    type?: string,
  ): Promise<PersistentRuntimeRecord[]> {
    return [...this.records.values()]
      .filter(
        (record) =>
          record.namespace === namespace &&
          (!type || record.type === type),
      )
      .map((record) => deepCopy(record));
  }

  async findOne(
    namespace: string,
    key: string,
  ): Promise<PersistentRuntimeRecord | undefined> {
    const record = this.records.get(`${namespace}:${key}`);
    return record ? deepCopy(record) : undefined;
  }

  async remove(namespace: string, key: string): Promise<boolean> {
    return this.records.delete(`${namespace}:${key}`);
  }

  async count(namespace?: string): Promise<number> {
    if (!namespace) return this.records.size;
    return [...this.records.values()].filter(
      (record) => record.namespace === namespace,
    ).length;
  }

  async health() {
    return {
      healthy: true,
      mode: 'memory' as const,
      details: {
        records: this.records.size,
      },
    };
  }
}
import { PersistentRuntimeRecord } from '../contracts/integration.contracts';

export const RUNTIME_PERSISTENCE_REPOSITORY =
  Symbol('RUNTIME_PERSISTENCE_REPOSITORY');

export interface RuntimePersistenceRepository {
  upsert(
    input: Omit<PersistentRuntimeRecord, 'createdAt' | 'updatedAt'>,
  ): Promise<PersistentRuntimeRecord>;

  find(
    namespace: string,
    type?: string,
  ): Promise<PersistentRuntimeRecord[]>;

  findOne(
    namespace: string,
    key: string,
  ): Promise<PersistentRuntimeRecord | undefined>;

  remove(namespace: string, key: string): Promise<boolean>;

  count(namespace?: string): Promise<number>;

  health(): Promise<{
    healthy: boolean;
    mode: 'database' | 'memory';
    details: Record<string, unknown>;
  }>;
}
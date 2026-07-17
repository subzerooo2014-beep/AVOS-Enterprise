import { Injectable, Logger, Optional } from '@nestjs/common';
import { PersistentRuntimeRecord } from '../contracts/integration.contracts';
import { RuntimePersistenceRepository } from './runtime-persistence.repository';
import { MemoryRuntimePersistenceRepository } from './memory-runtime-persistence.repository';
import { deepCopy, integrationNow } from '../shared/integration.utils';

interface PrismaLike {
  runtimeIntegrationRecord?: {
    upsert(args: unknown): Promise<unknown>;
    findMany(args?: unknown): Promise<unknown[]>;
    findUnique(args: unknown): Promise<unknown | null>;
    delete(args: unknown): Promise<unknown>;
    count(args?: unknown): Promise<number>;
  };
  $queryRawUnsafe?<T = unknown>(query: string): Promise<T>;
}

@Injectable()
export class PrismaRuntimePersistenceRepository
  implements RuntimePersistenceRepository
{
  private readonly logger = new Logger(
    PrismaRuntimePersistenceRepository.name,
  );

  constructor(
    private readonly fallback: MemoryRuntimePersistenceRepository,
    @Optional() private readonly prisma?: PrismaLike,
  ) {}

  async upsert(
    input: Omit<PersistentRuntimeRecord, 'createdAt' | 'updatedAt'>,
  ): Promise<PersistentRuntimeRecord> {
    const delegate = this.prisma?.runtimeIntegrationRecord;
    if (!delegate) {
      return this.fallback.upsert(input);
    }

    const timestamp = integrationNow();
    const result = (await delegate.upsert({
      where: {
        namespace_key: {
          namespace: input.namespace,
          key: input.key,
        },
      },
      create: {
        ...input,
        payload: input.payload,
        createdAt: timestamp,
        updatedAt: timestamp,
      },
      update: {
        type: input.type,
        payload: input.payload,
        version: input.version,
        status: input.status,
        updatedAt: timestamp,
      },
    })) as PersistentRuntimeRecord;

    return deepCopy(result);
  }

  async find(
    namespace: string,
    type?: string,
  ): Promise<PersistentRuntimeRecord[]> {
    const delegate = this.prisma?.runtimeIntegrationRecord;
    if (!delegate) {
      return this.fallback.find(namespace, type);
    }

    const rows = (await delegate.findMany({
      where: {
        namespace,
        ...(type ? { type } : {}),
      },
      orderBy: {
        updatedAt: 'desc',
      },
    })) as PersistentRuntimeRecord[];

    return rows.map((row) => deepCopy(row));
  }

  async findOne(
    namespace: string,
    key: string,
  ): Promise<PersistentRuntimeRecord | undefined> {
    const delegate = this.prisma?.runtimeIntegrationRecord;
    if (!delegate) {
      return this.fallback.findOne(namespace, key);
    }

    const row = (await delegate.findUnique({
      where: {
        namespace_key: {
          namespace,
          key,
        },
      },
    })) as PersistentRuntimeRecord | null;

    return row ? deepCopy(row) : undefined;
  }

  async remove(namespace: string, key: string): Promise<boolean> {
    const delegate = this.prisma?.runtimeIntegrationRecord;
    if (!delegate) {
      return this.fallback.remove(namespace, key);
    }

    try {
      await delegate.delete({
        where: {
          namespace_key: {
            namespace,
            key,
          },
        },
      });
      return true;
    } catch (error) {
      this.logger.warn(
        `Runtime integration record delete failed: ${String(error)}`,
      );
      return false;
    }
  }

  async count(namespace?: string): Promise<number> {
    const delegate = this.prisma?.runtimeIntegrationRecord;
    if (!delegate) {
      return this.fallback.count(namespace);
    }

    return delegate.count(
      namespace
        ? {
            where: { namespace },
          }
        : undefined,
    );
  }

  async health() {
    const delegate = this.prisma?.runtimeIntegrationRecord;
    if (!delegate) {
      const fallback = await this.fallback.health();
      return {
        ...fallback,
        details: {
          ...fallback.details,
          reason: 'Prisma runtimeIntegrationRecord delegate unavailable',
        },
      };
    }

    try {
      await delegate.count();
      return {
        healthy: true,
        mode: 'database' as const,
        details: {
          delegate: 'runtimeIntegrationRecord',
        },
      };
    } catch (error) {
      return {
        healthy: false,
        mode: 'database' as const,
        details: {
          error: String(error),
        },
      };
    }
  }
}
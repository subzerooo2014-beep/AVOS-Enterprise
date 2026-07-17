import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PersistentRuntimeRecord } from '../contracts/integration.contracts';
import { RuntimePersistenceRepository } from './runtime-persistence.repository';
import { MemoryRuntimePersistenceRepository } from './memory-runtime-persistence.repository';
import { deepCopy, integrationNow } from '../shared/integration.utils';
import { PrismaService } from '../../prisma/prisma.service';

type PrismaRuntimeRecord = {
  id: string;
  namespace: string;
  type: string;
  key: string;
  payload: Prisma.JsonValue;
  version: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class PrismaRuntimePersistenceRepository
  implements RuntimePersistenceRepository
{
  private readonly logger = new Logger(
    PrismaRuntimePersistenceRepository.name,
  );

  constructor(
    private readonly fallback: MemoryRuntimePersistenceRepository,
    private readonly prisma: PrismaService,
  ) {}

  private toPrismaPayload(payload: unknown): Prisma.InputJsonValue {
    const serialized = JSON.stringify(payload);

    if (serialized === undefined) {
      return {};
    }

    return JSON.parse(serialized) as Prisma.InputJsonValue;
  }

  private toPersistentRecord(
    record: PrismaRuntimeRecord,
  ): PersistentRuntimeRecord {
    return {
      id: record.id,
      namespace: record.namespace,
      type: record.type,
      key: record.key,
      payload: deepCopy(record.payload),
      version: record.version,
      status: record.status,
      createdAt: record.createdAt.toISOString(),
      updatedAt: record.updatedAt.toISOString(),
    };
  }

  async upsert(
    input: Omit<PersistentRuntimeRecord, 'createdAt' | 'updatedAt'>,
  ): Promise<PersistentRuntimeRecord> {
    const timestamp = new Date(integrationNow());
    const payload = this.toPrismaPayload(input.payload);

    const result = await this.prisma.runtimeIntegrationRecord.upsert({
      where: {
        namespace_key: {
          namespace: input.namespace,
          key: input.key,
        },
      },
      create: {
        id: input.id,
        namespace: input.namespace,
        type: input.type,
        key: input.key,
        payload,
        version: input.version,
        status: input.status,
        createdAt: timestamp,
        updatedAt: timestamp,
      },
      update: {
        type: input.type,
        payload,
        version: input.version,
        status: input.status,
        updatedAt: timestamp,
      },
    });

    return this.toPersistentRecord(result);
  }

  async find(
    namespace: string,
    type?: string,
  ): Promise<PersistentRuntimeRecord[]> {
    const rows = await this.prisma.runtimeIntegrationRecord.findMany({
      where: {
        namespace,
        ...(type ? { type } : {}),
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return rows.map((row) => this.toPersistentRecord(row));
  }

  async findOne(
    namespace: string,
    key: string,
  ): Promise<PersistentRuntimeRecord | undefined> {
    const row = await this.prisma.runtimeIntegrationRecord.findUnique({
      where: {
        namespace_key: {
          namespace,
          key,
        },
      },
    });

    return row ? this.toPersistentRecord(row) : undefined;
  }

  async remove(namespace: string, key: string): Promise<boolean> {
    try {
      await this.prisma.runtimeIntegrationRecord.delete({
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
    return this.prisma.runtimeIntegrationRecord.count(
      namespace
        ? {
            where: {
              namespace,
            },
          }
        : undefined,
    );
  }

  async health() {
    try {
      const records = await this.prisma.runtimeIntegrationRecord.count();

      return {
        healthy: true,
        mode: 'database' as const,
        details: {
          delegate: 'runtimeIntegrationRecord',
          records,
        },
      };
    } catch (error) {
      const fallback = await this.fallback.health();

      return {
        ...fallback,
        details: {
          ...fallback.details,
          reason: 'Prisma runtimeIntegrationRecord database check failed',
          error: String(error),
        },
      };
    }
  }
}

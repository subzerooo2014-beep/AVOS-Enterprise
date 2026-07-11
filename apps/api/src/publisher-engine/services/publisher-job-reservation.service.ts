import { Injectable, Logger } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { PrismaService } from "../../prisma/prisma.service";

export interface PublisherReservationOptions {
  workerId: string;
  limit: number;
  lockTimeoutMinutes?: number;
}

export interface PublisherReservationResult {
  success: boolean;
  workerId: string;
  requested: number;
  selected: number;
  reserved: number;
  jobs: any[];
  reservedAt: Date;
}

@Injectable()
export class PublisherJobReservationService {
  private readonly logger = new Logger(
    PublisherJobReservationService.name,
  );

  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async reserveBatch(
    options: PublisherReservationOptions,
  ): Promise<PublisherReservationResult> {
    const workerId = this.requireWorkerId(options.workerId);
    const limit = this.normalizeLimit(options.limit);
    const reservedAt = new Date();

    const jobs = await this.prisma.$transaction(
      async (transaction: any) => {
        const candidates = await transaction.publishJob.findMany({
          where: {
            status: {
              in: ["queued", "retrying"],
            },
            lockToken: null,
            AND: [
              {
                OR: [
                  {
                    scheduledAt: null,
                  },
                  {
                    scheduledAt: {
                      lte: reservedAt,
                    },
                  },
                ],
              },
            ],
          },
          orderBy: [
            {
              createdAt: "asc",
            },
          ],
          take: limit,
        });

        const reservedJobs: any[] = [];

        for (const candidate of candidates) {
          const lockToken = randomUUID();

          const claimed = await transaction.publishJob.updateMany({
            where: {
              id: candidate.id,
              status: {
                in: ["queued", "retrying"],
              },
              lockToken: null,
            },
            data: {
              workerId,
              lockToken,
              lockedAt: reservedAt,
            },
          });

          if (claimed.count !== 1) {
            continue;
          }

          reservedJobs.push({
            ...candidate,
            workerId,
            lockToken,
            lockedAt: reservedAt,
          });
        }

        return reservedJobs;
      },
      {
        timeout: 30_000,
      },
    );

    this.logger.log(
      `Publisher jobs reserved: workerId=${workerId}, requested=${limit}, reserved=${jobs.length}`,
    );

    return {
      success: true,
      workerId,
      requested: limit,
      selected: jobs.length,
      reserved: jobs.length,
      jobs,
      reservedAt,
    };
  }

  async reserveOne(
    jobId: string,
    workerId: string,
  ): Promise<any | null> {
    const normalizedJobId = this.requireText(jobId, "jobId");
    const normalizedWorkerId = this.requireWorkerId(workerId);
    const lockToken = randomUUID();
    const lockedAt = new Date();

    return this.prisma.$transaction(
      async (transaction: any) => {
        const claimed = await transaction.publishJob.updateMany({
          where: {
            id: normalizedJobId,
            status: {
              in: ["queued", "retrying"],
            },
            lockToken: null,
          },
          data: {
            workerId: normalizedWorkerId,
            lockToken,
            lockedAt,
          },
        });

        if (claimed.count !== 1) {
          return null;
        }

        return transaction.publishJob.findUnique({
          where: {
            id: normalizedJobId,
          },
        });
      },
      {
        timeout: 30_000,
      },
    );
  }

  async release(
    jobId: string,
    lockToken: string,
  ): Promise<boolean> {
    const result = await (this.prisma as any).publishJob.updateMany({
      where: {
        id: this.requireText(jobId, "jobId"),
        lockToken: this.requireText(lockToken, "lockToken"),
      },
      data: {
        workerId: null,
        lockToken: null,
        lockedAt: null,
      },
    });

    return result.count === 1;
  }

  async releaseExpired(
    timeoutMinutes = 10,
  ): Promise<number> {
    const normalizedTimeout = Number.isFinite(Number(timeoutMinutes))
      ? Math.max(1, Math.trunc(Number(timeoutMinutes)))
      : 10;

    const expiresBefore = new Date(
      Date.now() - normalizedTimeout * 60_000,
    );

    const result = await (this.prisma as any).publishJob.updateMany({
      where: {
        status: {
          in: ["queued", "retrying", "locked", "processing"],
        },
        lockedAt: {
          lt: expiresBefore,
        },
        lockToken: {
          not: null,
        },
      },
      data: {
        workerId: null,
        lockToken: null,
        lockedAt: null,
        status: "queued",
      },
    });

    if (result.count > 0) {
      this.logger.warn(
        `Released ${result.count} expired publisher job lock(s)`,
      );
    }

    return result.count;
  }

  private normalizeLimit(value: unknown): number {
    const numeric = Number(value);

    if (!Number.isFinite(numeric)) {
      return 20;
    }

    return Math.min(
      Math.max(Math.trunc(numeric), 1),
      200,
    );
  }

  private requireWorkerId(value: unknown): string {
    return this.requireText(value, "workerId");
  }

  private requireText(
    value: unknown,
    field: string,
  ): string {
    if (typeof value !== "string" || !value.trim()) {
      throw new Error(`${field} must be a non-empty string`);
    }

    return value.trim();
  }
}

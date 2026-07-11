import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { PublisherRegistryService } from "../publisher-registry.service";
import { PublisherContextBuilderService } from "./publisher-context-builder.service";
import { PublisherResultNormalizerService } from "./publisher-result-normalizer.service";
import { diffMs } from "../utils/publisher-time.util";

@Injectable()
export class PublisherDispatchCoreService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly registry: PublisherRegistryService,
    private readonly contextBuilder: PublisherContextBuilderService,
    private readonly normalizer: PublisherResultNormalizerService,
  ) {}

  async dispatchOne(job: any) {
    this.validateReservedJob(job);

    const startedAt = new Date();
    const context = this.contextBuilder.build(job);
    const adapter = this.registry.get(context.channel);

    const rawResult = await adapter.publish(context);
    const result = this.normalizer.normalize(
      context.channel,
      rawResult,
    );

    if (
      result.status !== "published" &&
      result.status !== "skipped"
    ) {
      throw new Error(
        result.message ||
          `Publisher "${context.channel}" returned status "${result.status}"`,
      );
    }

    const completedAt = new Date();
    const durationMs = diffMs(startedAt);

    const savedJob = await (this.prisma as any).$transaction(
      async (transaction: any) => {
        const ownershipWhere: any = {
          id: job.id,
        };

        if (job.lockToken) {
          ownershipWhere.lockToken = job.lockToken;
        }

        if (job.workerId) {
          ownershipWhere.workerId = job.workerId;
        }

        const updated = await transaction.publishJob.updateMany({
          where: ownershipWhere,
          data: {
            status:
              result.status === "skipped"
                ? "skipped"
                : "published",
            result: {
              ...result,
              durationMs,
              completedAt: completedAt.toISOString(),
            },
            publishedAt:
              result.status === "published"
                ? completedAt
                : null,
            failedAt: null,
            lastError: null,
            workerId: null,
            lockToken: null,
            lockedAt: null,
          },
        });

        if (updated.count !== 1) {
          throw new Error(
            `Publisher job "${job.id}" ownership was lost before completion`,
          );
        }

        return transaction.publishJob.findUnique({
          where: {
            id: job.id,
          },
        });
      },
      {
        timeout: 30_000,
      },
    );

    return {
      success: true,
      status: result.status,
      channel: context.channel,
      jobId: job.id,
      result,
      job: savedJob,
      durationMs,
      completedAt,
    };
  }

  private validateReservedJob(job: any): void {
    if (!job || typeof job !== "object") {
      throw new Error("Publisher job is required");
    }

    if (typeof job.id !== "string" || !job.id.trim()) {
      throw new Error("Publisher job id is required");
    }

    if (
      typeof job.workerId !== "string" ||
      !job.workerId.trim()
    ) {
      throw new Error(
        `Publisher job "${job.id}" has no worker reservation`,
      );
    }

    if (
      typeof job.lockToken !== "string" ||
      !job.lockToken.trim()
    ) {
      throw new Error(
        `Publisher job "${job.id}" has no lock token`,
      );
    }

    if (!job.lockedAt) {
      throw new Error(
        `Publisher job "${job.id}" has no lock timestamp`,
      );
    }
  }
}

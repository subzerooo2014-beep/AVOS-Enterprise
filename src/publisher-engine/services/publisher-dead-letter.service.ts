import {
  Injectable,
  Logger,
} from "@nestjs/common";

import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class PublisherDeadLetterService {
  private readonly logger = new Logger(
    PublisherDeadLetterService.name,
  );

  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async move(
    job: any,
    error?: unknown,
  ): Promise<any> {
    if (!job?.id) {
      throw new Error(
        "Cannot move publisher job to dead letter queue without an id",
      );
    }

    const delegate =
      this.publishJobDelegate();

    const message =
      this.errorMessage(error);

    const failedAt = new Date();

    const updated = await delegate.update({
      where: {
        id: job.id,
      },

      data: {
        status: "dead",
        lastError:
          message.slice(0, 5000),
        failedAt,
        publishedAt: null,
        workerId: null,
        lockToken: null,
        lockedAt: null,
      },
    });

    this.logger.error(
      `Publisher job moved to dead letter queue: jobId=${job.id}, channel=${this.channelOf(
        job,
      )}, error=${message}`,
    );

    return {
      success: false,
      status: "dead",
      deadLettered: true,
      job: updated,

      error: {
        message,
      },

      movedAt: failedAt,
    };
  }

  private publishJobDelegate(): any {
    const prisma = this.prisma as any;

    for (const name of [
      "publishJob",
      "publisherJob",
      "publishingJob",
      "aiPublishJob",
    ]) {
      const delegate = prisma[name];

      if (
        delegate &&
        typeof delegate.update === "function"
      ) {
        return delegate;
      }
    }

    throw new Error(
      "No Prisma publisher job model supports dead letter persistence",
    );
  }

  private channelOf(
    job: any,
  ): string {
    return String(
      job?.channel ??
        job?.result?.channel ??
        job?.metadata?.channel ??
        "unknown",
    );
  }

  private errorMessage(
    error: unknown,
  ): string {
    if (error instanceof Error) {
      return error.message;
    }

    return String(
      error ??
        "Publisher attempts exhausted",
    );
  }
}

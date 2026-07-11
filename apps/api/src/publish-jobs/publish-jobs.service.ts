import {
  Injectable,
  Logger,
} from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service";
import { PublisherDispatcherService } from "../publisher-engine/publisher-dispatcher.service";
import { PublisherRegistryService } from "../publisher-engine/publisher-registry.service";

@Injectable()
export class PublishJobsService {
  private readonly logger = new Logger(
    PublishJobsService.name,
  );

  constructor(
    private readonly prisma: PrismaService,
    private readonly dispatcher: PublisherDispatcherService,
    private readonly registry: PublisherRegistryService,
  ) {}

  async create(vehicleId: string) {
    return this.createChannelJob(
      vehicleId,
      "internal",
      "Publish vehicle listing",
      "queued",
    );
  }

  async createChannelJob(
    vehicleId: string,
    channel: string,
    title: string,
    status = "queued",
    content?: string,
    extra?: any,
  ) {
    const normalizedVehicleId = this.requiredText(
      vehicleId,
      "vehicleId",
    );

    const requestedChannel = this.requiredText(
      channel,
      "channel",
    ).toLowerCase();

    const adapter = this.registry.get(
      requestedChannel,
    );

    const canonicalChannel = adapter.channel;
    const normalizedStatus =
      this.normalizeStatus(status);

    const existing = await this.findActiveDuplicate(
      normalizedVehicleId,
      canonicalChannel,
    );

    if (existing) {
      this.logger.warn(
        `Active publisher job already exists: vehicleId=${normalizedVehicleId}, channel=${canonicalChannel}, jobId=${existing.id}`,
      );

      return {
        ...existing,
        duplicatePrevented: true,
      };
    }

    const sourceMetadata =
      extra?.metadata &&
      typeof extra.metadata === "object" &&
      !Array.isArray(extra.metadata)
        ? extra.metadata
        : {};

    const job = await (this.prisma as any).publishJob.create({
      data: {
        title: this.requiredText(
          title,
          "title",
        ),

        content:
          content?.trim() ||
          `vehicle:${normalizedVehicleId}`,

        status: normalizedStatus,

        priority:
          this.normalizePriority(
            extra?.priority,
          ),

        correlationId:
          typeof extra?.correlationId === "string" &&
          extra.correlationId.trim()
            ? extra.correlationId.trim()
            : null,

        maxRetries:
          this.normalizeMaxRetries(
            extra?.maxRetries,
          ),

        result: {
          ...(
            extra &&
            typeof extra === "object" &&
            !Array.isArray(extra)
              ? extra
              : {}
          ),

          entityType: "vehicle",
          entityId: normalizedVehicleId,
          vehicleId: normalizedVehicleId,
          channel: canonicalChannel,
          source: "ai-publishing-pipeline",

          publisher: {
            ...(
              extra?.publisher &&
              typeof extra.publisher === "object" &&
              !Array.isArray(extra.publisher)
                ? extra.publisher
                : {}
            ),
            channel: canonicalChannel,
          },

          metadata: {
            ...sourceMetadata,
            vehicleId: normalizedVehicleId,
            requestedChannel,
            canonicalChannel,
            createdBy:
              sourceMetadata.createdBy ??
              "ai-publishing-pipeline",
          },
        },
      },
    });

    this.logger.log(
      `Publisher job created: jobId=${job.id}, vehicleId=${normalizedVehicleId}, channel=${canonicalChannel}, status=${normalizedStatus}`,
    );

    if (normalizedStatus === "queued") {
      this.dispatchInBackground(job.id);
    }

    return job;
  }

  async forVehicle(vehicleId: string) {
    const normalizedVehicleId = this.requiredText(
      vehicleId,
      "vehicleId",
    );

    return (this.prisma as any).publishJob.findMany({
      where: {
        OR: [
          {
            content: {
              contains: normalizedVehicleId,
            },
          },
          {
            result: {
              path: "$.vehicleId",
              equals: normalizedVehicleId,
            },
          },
          {
            result: {
              path: "$.entityId",
              equals: normalizedVehicleId,
            },
          },
        ],
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async all() {
    return (this.prisma as any).publishJob.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  private async findActiveDuplicate(
    vehicleId: string,
    channel: string,
  ): Promise<any | null> {
    try {
      return await (this.prisma as any).publishJob.findFirst({
        where: {
          status: {
            in: [
              "queued",
              "retrying",
              "locked",
              "processing",
            ],
          },

          AND: [
            {
              result: {
                path: ["vehicleId"],
                equals: vehicleId,
              },
            },
            {
              result: {
                path: ["channel"],
                equals: channel,
              },
            },
          ],
        },

        orderBy: {
          createdAt: "desc",
        },
      });
    } catch (error) {
      this.logger.warn(
        `Publisher duplicate query fallback used: ${this.errorMessage(
          error,
        )}`,
      );

      const candidates =
        await (this.prisma as any).publishJob.findMany({
          where: {
            status: {
              in: [
                "queued",
                "retrying",
                "locked",
                "processing",
              ],
            },

            content: {
              contains: vehicleId,
            },
          },

          orderBy: {
            createdAt: "desc",
          },

          take: 20,
        });

      return (
        candidates.find(
          (job: any) =>
            job?.result?.channel === channel &&
            (
              job?.result?.vehicleId === vehicleId ||
              job?.result?.entityId === vehicleId
            ),
        ) ?? null
      );
    }
  }

  private dispatchInBackground(
    jobId: string,
  ): void {
    setImmediate(() => {
      void this.dispatcher
        .dispatchOne(jobId)
        .then((result: any) => {
          this.logger.log(
            `Publisher job dispatched automatically: jobId=${jobId}, status=${String(
              result?.status ?? "unknown",
            )}`,
          );
        })
        .catch((error) => {
          this.logger.error(
            `Automatic publisher dispatch failed: jobId=${jobId}, error=${this.errorMessage(
              error,
            )}`,
            error instanceof Error
              ? error.stack
              : undefined,
          );
        });
    });
  }

  private normalizeStatus(
    value: unknown,
  ): string {
    const status = String(
      value ?? "queued",
    )
      .trim()
      .toLowerCase();

    return [
      "queued",
      "retrying",
      "skipped",
    ].includes(status)
      ? status
      : "queued";
  }

  private normalizePriority(
    value: unknown,
  ): string {
    const priority = String(
      value ?? "normal",
    )
      .trim()
      .toLowerCase();

    return [
      "low",
      "normal",
      "high",
      "critical",
    ].includes(priority)
      ? priority
      : "normal";
  }

  private normalizeMaxRetries(
    value: unknown,
  ): number {
    const numeric = Number(value);

    if (
      !Number.isInteger(numeric) ||
      numeric < 0
    ) {
      return 3;
    }

    return Math.min(numeric, 20);
  }

  private requiredText(
    value: unknown,
    field: string,
  ): string {
    if (
      typeof value !== "string" ||
      !value.trim()
    ) {
      throw new Error(
        `${field} must be a non-empty string`,
      );
    }

    return value.trim();
  }

  private errorMessage(
    error: unknown,
  ): string {
    return error instanceof Error
      ? error.message
      : String(
          error ?? "Unknown publish job error",
        );
  }
}


import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from "@nestjs/common";

import { PrismaService } from "../../prisma/prisma.service";

import { SocialHttpDeliveryService } from "./social-http-delivery.service";
import { ExternalDeliveryService } from "../external-connectors/external-delivery.service";
import {
  SocialDeliveryChannel,
} from "./social-delivery.contracts";

@Injectable()
export class SocialDeliveryWorkerService
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger =
    new Logger(
      SocialDeliveryWorkerService.name,
    );

  private timer:
    | NodeJS.Timeout
    | null = null;

  private running = false;

  private processedCount = 0;
  private deliveredCount = 0;
  private retryingCount = 0;
  private deadCount = 0;
  private awaitingCredentialsCount = 0;

  private readonly pollIntervalMs =
    this.positiveInteger(
      process.env.SOCIAL_DELIVERY_POLL_INTERVAL_MS,
      10_000,
    );

  private readonly batchSize =
    this.positiveInteger(
      process.env.SOCIAL_DELIVERY_BATCH_SIZE,
      10,
    );

  private readonly maxAttempts =
    this.positiveInteger(
      process.env.SOCIAL_DELIVERY_MAX_ATTEMPTS,
      3,
    );

  private readonly automaticPolling =
    String(
      process.env.SOCIAL_DELIVERY_AUTO_START ??
      "true",
    ).toLowerCase() !== "false";

  constructor(
    private readonly prisma: PrismaService,
    private readonly delivery: SocialHttpDeliveryService,
    private readonly externalDelivery: ExternalDeliveryService,
  ) {}

  onModuleInit(): void {
    if (!this.automaticPolling) {
      this.logger.warn(
        "Social Delivery Worker automatic polling is disabled.",
      );

      return;
    }

    this.timer = setInterval(
      () => {
        void this.runOnce(
          this.batchSize,
        );
      },
      this.pollIntervalMs,
    );

    this.timer.unref?.();

    this.logger.log(
      `Social Delivery Worker started: intervalMs=${this.pollIntervalMs}, batchSize=${this.batchSize}`,
    );
  }

  onModuleDestroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  async runOnce(
    limit = this.batchSize,
  ): Promise<any> {
    if (this.running) {
      return {
        success: false,
        skipped: true,
        message:
          "Social Delivery Worker is already running.",
      };
    }

    this.running = true;

    const startedAt =
      new Date();

    try {
      const events =
        await (this.prisma as any).platformEvent.findMany({
          where: {
            type: {
              in: [
                "InstagramVehiclePublicationRequested",
                "TikTokVehiclePublicationRequested",
                "GoogleSearchVehicleCampaignRequested",
              ],
            },

            status: {
              in: [
                "queued",
                "retrying",
              ],
            },
          },

          orderBy: {
            createdAt: "asc",
          },

          take:
            this.normalizeLimit(limit),
        });

      const results: any[] = [];

      for (const event of events) {
        results.push(
          await this.processEvent(
            event,
          ),
        );
      }

      const finishedAt =
        new Date();

      return {
        success: true,
        selected: events.length,
        results,
        startedAt,
        finishedAt,

        durationMs:
          finishedAt.getTime() -
          startedAt.getTime(),
      };
    } finally {
      this.running = false;
    }
  }

  async processById(
    eventId: string,
  ): Promise<any> {
    const event =
      await (this.prisma as any).platformEvent.findUnique({
        where: {
          id: eventId,
        },
      });

    if (!event) {
      throw new Error(
        `PlatformEvent "${eventId}" was not found.`,
      );
    }

    return this.processEvent(event);
  }

  status(): any {
    return {
      success: true,
      worker:
        "SocialDeliveryWorkerV1",
      running: this.running,
      automaticPolling:
        this.automaticPolling,
      pollIntervalMs:
        this.pollIntervalMs,
      batchSize:
        this.batchSize,
      maxAttempts:
        this.maxAttempts,

      counters: {
        processed:
          this.processedCount,
        delivered:
          this.deliveredCount,
        retrying:
          this.retryingCount,
        dead:
          this.deadCount,
        awaitingCredentials:
          this.awaitingCredentialsCount,
      },

      providers:
        this.externalDelivery.providers(),
    };
  }

  credentialsReadiness(): any {
    const providers =
      this.externalDelivery.providers();

    return {
      success: true,

      ready:
        providers.every(
          (provider: any) =>
            provider.configured,
        ),

      configuredCount:
        providers.filter(
          (provider: any) =>
            provider.configured,
        ).length,

      totalProviders:
        providers.length,

      providers,

      checkedAt:
        new Date(),
    };
  }

  async requeueAwaitingCredentials(
    channel?: string,
  ): Promise<any> {
    const supportedChannels = [
      "instagram",
      "tiktok",
      "google_search",
    ];

    const normalizedChannel =
      channel?.trim().toLowerCase();

    if (
      normalizedChannel &&
      !supportedChannels.includes(
        normalizedChannel,
      )
    ) {
      throw new Error(
        `Unsupported social channel "${normalizedChannel}".`,
      );
    }

    const providerStates =
      this.externalDelivery.providers();

    const configuredChannels =
      providerStates
        .filter(
          (provider: any) =>
            provider.configured,
        )
        .map(
          (provider: any) =>
            provider.channel,
        );

    const selectedChannels =
      normalizedChannel
        ? configuredChannels.filter(
            (item: string) =>
              item === normalizedChannel,
          )
        : configuredChannels;

    if (
      selectedChannels.length === 0
    ) {
      return {
        success: false,
        requeued: 0,
        message:
          normalizedChannel
            ? `${normalizedChannel} is not configured.`
            : "No configured social providers are available.",
        configuredChannels,
      };
    }

    const eventTypes =
      selectedChannels.map(
        (item: string) =>
          this.eventTypeFromChannel(
            item,
          ),
      );

    const candidates =
      await (this.prisma as any).platformEvent.findMany({
        where: {
          status:
            "awaiting_credentials",

          type: {
            in: eventTypes,
          },
        },

        orderBy: {
          createdAt: "asc",
        },
      });

    let requeued = 0;

    for (const event of candidates) {
      const result =
        this.objectOf(
          event.result,
        );

      const delivery =
        this.objectOf(
          result.delivery,
        );

      await (this.prisma as any).platformEvent.update({
        where: {
          id: event.id,
        },

        data: {
          status: "queued",

          result: {
            ...result,

            delivery: {
              ...delivery,
              status: "queued",
              requeuedAt:
                new Date().toISOString(),
              reason:
                "Provider credentials became available.",
            },
          },

          updatedAt:
            new Date(),
        },
      });

      requeued += 1;
    }

    return {
      success: true,
      requeued,
      channels:
        selectedChannels,
      eventTypes,
      requeuedAt:
        new Date(),
    };
  }

  async requeueAndRun(
    channel?: string,
    limit = this.batchSize,
  ): Promise<any> {
    const requeue =
      await this.requeueAwaitingCredentials(
        channel,
      );

    if (
      !requeue.success ||
      requeue.requeued === 0
    ) {
      return {
        success:
          requeue.success,
        requeue,
        dispatch: null,
      };
    }

    const dispatch =
      await this.runOnce(limit);

    return {
      success: true,
      requeue,
      dispatch,
    };
  }

  async queue(
    limit = 50,
  ): Promise<any[]> {
    return (this.prisma as any).platformEvent.findMany({
      where: {
        type: {
          in: [
            "InstagramVehiclePublicationRequested",
            "TikTokVehiclePublicationRequested",
            "GoogleSearchVehicleCampaignRequested",
          ],
        },

        status: {
          in: [
            "queued",
            "processing",
            "retrying",
            "awaiting_credentials",
            "dead",
          ],
        },
      },

      orderBy: {
        updatedAt: "desc",
      },

      take:
        this.normalizeLimit(limit),
    });
  }

  private async processEvent(
    event: any,
  ): Promise<any> {
    const channel =
      this.channelFromEvent(
        event,
      );

    if (!channel) {
      return {
        success: false,
        eventId: event.id,
        status: "skipped",
        message:
          "Unsupported social delivery event type.",
      };
    }

    const previousResult =
      this.objectOf(
        event.result,
      );

    const previousDelivery =
      this.objectOf(
        previousResult.delivery,
      );

    const attempt =
      Number(
        previousDelivery.attempt ?? 0,
      ) + 1;

    const startedAt =
      new Date();

    await this.updateEvent(
      event.id,
      "processing",
      {
        ...previousResult,

        delivery: {
          ...previousDelivery,
          channel,
          attempt,
          status: "processing",
          startedAt:
            startedAt.toISOString(),
          completedAt: null,
        },
      },
    );

    const deliveryResult =
      await this.delivery.deliver({
        channel,
        eventId: event.id,
        payload: event.payload,
        attempt,
      });

    const completedAt =
      deliveryResult.completedAt ??
      new Date();

    const durationMs =
      Math.max(
        0,
        completedAt.getTime() -
        startedAt.getTime(),
      );

    this.processedCount += 1;

    const finalDeliveryBase = {
      ...previousDelivery,
      ...deliveryResult,
      channel,
      attempt,
      startedAt:
        startedAt.toISOString(),
      completedAt:
        completedAt.toISOString(),
      durationMs,
    };

    if (
      deliveryResult.status ===
      "awaiting_credentials"
    ) {
      this.awaitingCredentialsCount += 1;

      await this.updateEvent(
        event.id,
        "awaiting_credentials",
        {
          ...previousResult,

          delivery: {
            ...finalDeliveryBase,
            status:
              "awaiting_credentials",
          },
        },
      );

      return {
        ...deliveryResult,
        startedAt,
        completedAt,
        durationMs,
      };
    }

    if (deliveryResult.success) {
      this.deliveredCount += 1;

      await this.updateEvent(
        event.id,
        "delivered",
        {
          ...previousResult,

          delivery: {
            ...finalDeliveryBase,
            status:
              "delivered",
            success: true,
          },
        },
      );

      return {
        ...deliveryResult,
        startedAt,
        completedAt,
        durationMs,
      };
    }

    const terminal =
      attempt >= this.maxAttempts;

    const status =
      terminal
        ? "dead"
        : "retrying";

    if (terminal) {
      this.deadCount += 1;
    } else {
      this.retryingCount += 1;
    }

    await this.updateEvent(
      event.id,
      status,
      {
        ...previousResult,

        delivery: {
          ...finalDeliveryBase,
          status,
          terminal,
          success: false,
        },
      },
    );

    return {
      ...deliveryResult,
      status,
      terminal,
      startedAt,
      completedAt,
      durationMs,
    };
  }
  private async updateEvent(
    id: string,
    status: string,
    result: any,
  ): Promise<void> {
    await (this.prisma as any).platformEvent.update({
      where: {
        id,
      },

      data: {
        status,
        result,
        updatedAt:
          new Date(),
      },
    });
  }

  private eventTypeFromChannel(
    channel: string,
  ): string {
    switch (channel) {
      case "instagram":
        return "InstagramVehiclePublicationRequested";

      case "tiktok":
        return "TikTokVehiclePublicationRequested";

      case "google_search":
        return "GoogleSearchVehicleCampaignRequested";

      default:
        throw new Error(
          `Unsupported social channel "${channel}".`,
        );
    }
  }

  private channelFromEvent(
    event: any,
  ): SocialDeliveryChannel | null {
    switch (event?.type) {
      case "InstagramVehiclePublicationRequested":
        return "instagram";

      case "TikTokVehiclePublicationRequested":
        return "tiktok";

      case "GoogleSearchVehicleCampaignRequested":
        return "google_search";

      default:
        return null;
    }
  }

  private objectOf(
    value: any,
  ): Record<string, any> {
    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value)
    ) {
      return value;
    }

    return {};
  }

  private normalizeLimit(
    value: unknown,
  ): number {
    const numeric =
      Number(value);

    if (
      !Number.isFinite(numeric)
    ) {
      return this.batchSize;
    }

    return Math.min(
      100,
      Math.max(
        1,
        Math.trunc(numeric),
      ),
    );
  }

  private positiveInteger(
    value: string | undefined,
    fallback: number,
  ): number {
    const numeric =
      Number(value);

    return Number.isInteger(numeric) &&
      numeric > 0
      ? numeric
      : fallback;
  }
}






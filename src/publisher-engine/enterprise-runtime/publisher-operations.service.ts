import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import { randomUUID } from "node:crypto";

import { PrismaService } from "../../prisma/prisma.service";
import { SocialDeliveryWorkerService } from "../social-delivery/social-delivery-worker.service";

type PublicationOperation =
  | "cancel"
  | "retry"
  | "retry_now"
  | "clone"
  | "replay";

@Injectable()
export class PublisherOperationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly worker: SocialDeliveryWorkerService,
  ) {}

  async cancel(
    eventId: string,
    reason?: string,
  ) {
    const event =
      await this.event(eventId);

    if (
      [
        "delivered",
        "cancelled",
      ].includes(event.status)
    ) {
      throw new ConflictException(
        `Publication cannot be cancelled from status "${event.status}".`,
      );
    }

    const updated =
      await this.updateWithOperation({
        event,
        nextStatus: "cancelled",
        operation: "cancel",
        details: {
          reason:
            reason?.trim() ||
            "Publication cancelled manually.",
        },
      });

    await this.audit(
      "PUBLICATION_CANCELLED",
      eventId,
    );

    return {
      success: true,
      operation: "cancel",
      eventId,
      previousStatus:
        event.status,
      status:
        updated.status,
      cancelledAt:
        updated.updatedAt,
    };
  }

  async retry(
    eventId: string,
    reason?: string,
  ) {
    const event =
      await this.event(eventId);

    this.assertRetryable(event);

    const updated =
      await this.updateWithOperation({
        event,
        nextStatus: "queued",
        operation: "retry",
        details: {
          reason:
            reason?.trim() ||
            "Publication queued for manual retry.",
        },
        resetDeliveryError: true,
      });

    await this.audit(
      "PUBLICATION_RETRY_QUEUED",
      eventId,
    );

    return {
      success: true,
      operation: "retry",
      eventId,
      previousStatus:
        event.status,
      status:
        updated.status,
      queuedAt:
        updated.updatedAt,
    };
  }

  async retryNow(
    eventId: string,
    reason?: string,
  ) {
    const queued =
      await this.retry(
        eventId,
        reason ??
          "Publication queued for immediate retry.",
      );

    const dispatch =
      await this.worker.processById(
        eventId,
      );

    await this.appendOperation(
      eventId,
      "retry_now",
      {
        dispatchStatus:
          dispatch?.status ?? null,
        success:
          dispatch?.success ?? false,
      },
    );

    await this.audit(
      "PUBLICATION_RETRY_EXECUTED",
      eventId,
    );

    return {
      success:
        Boolean(
          dispatch?.success,
        ),
      operation:
        "retry_now",
      queued,
      dispatch,
    };
  }

  async clone(
    eventId: string,
    overrides?: {
      title?: string;
      content?: any;
      campaign?: any;
      metadata?: any;
    },
  ) {
    const source =
      await this.event(eventId);

    const now =
      new Date();

    const sourcePayload =
      this.objectOf(
        source.payload,
      );

    const sourceResult =
      this.objectOf(
        source.result,
      );

    const sourceVersion =
      Number(
        sourcePayload.contentVersion ??
        sourcePayload.version ??
        1,
      );

    const newId =
      randomUUID();

    const clonedPayload = {
      ...sourcePayload,

      content:
        overrides?.content ??
        sourcePayload.content ??
        null,

      campaign: {
        ...this.objectOf(
          sourcePayload.campaign,
        ),
        ...this.objectOf(
          overrides?.campaign,
        ),
      },

      metadata: {
        ...this.objectOf(
          sourcePayload.metadata,
        ),
        ...this.objectOf(
          overrides?.metadata,
        ),

        clonedFromEventId:
          source.id,

        clonedAt:
          now.toISOString(),
      },

      contentVersion:
        sourceVersion + 1,

      parentEventId:
        source.id,

      operation:
        "clone",
    };

    const created =
      await (this.prisma as any).platformEvent.create({
        data: {
          id: newId,
          type:
            source.type,
          source:
            source.source,
          entityType:
            source.entityType,
          entityId:
            source.entityId,
          status:
            "queued",
          payload:
            clonedPayload,

          result: {
            message:
              "Publication cloned and queued.",

            clonedFrom: {
              eventId:
                source.id,
              status:
                source.status,
              externalId:
                this.externalId(
                  sourceResult,
                ),
            },

            operations: [
              this.operationRecord(
                "clone",
                {
                  sourceEventId:
                    source.id,
                },
                now,
              ),
            ],
          },

          updatedAt:
            now,
        },
      });

    await this.audit(
      "PUBLICATION_CLONED",
      created.id,
    );

    return {
      success: true,
      operation: "clone",
      sourceEventId:
        source.id,
      eventId:
        created.id,
      status:
        created.status,
      contentVersion:
        clonedPayload.contentVersion,
      createdAt:
        created.createdAt,
    };
  }

  async replay(
    eventId: string,
    overrides?: {
      content?: any;
      campaign?: any;
      metadata?: any;
    },
  ) {
    const cloned =
      await this.clone(
        eventId,
        overrides,
      );

    const dispatch =
      await this.worker.processById(
        cloned.eventId,
      );

    await this.appendOperation(
      cloned.eventId,
      "replay",
      {
        sourceEventId:
          eventId,
        dispatchStatus:
          dispatch?.status ?? null,
        success:
          dispatch?.success ?? false,
      },
    );

    await this.audit(
      "PUBLICATION_REPLAYED",
      cloned.eventId,
    );

    return {
      success:
        Boolean(
          dispatch?.success,
        ),
      operation: "replay",
      sourceEventId:
        eventId,
      cloned,
      dispatch,
    };
  }

  async operationHistory(
    eventId: string,
  ) {
    const event =
      await this.event(eventId);

    const result =
      this.objectOf(
        event.result,
      );

    const operations =
      Array.isArray(
        result.operations,
      )
        ? result.operations
        : [];

    return {
      success: true,
      eventId:
        event.id,
      status:
        event.status,
      count:
        operations.length,
      operations,
    };
  }

  private async event(
    eventId: string,
  ) {
    const normalized =
      String(eventId)
        .trim();

    if (!normalized) {
      throw new BadRequestException(
        "eventId is required.",
      );
    }

    const event =
      await (this.prisma as any).platformEvent.findUnique({
        where: {
          id: normalized,
        },
      });

    if (!event) {
      throw new NotFoundException(
        "PlatformEvent not found.",
      );
    }

    if (
      !this.supportedEventTypes()
        .includes(event.type)
    ) {
      throw new BadRequestException(
        `PlatformEvent type "${event.type}" does not support publication operations.`,
      );
    }

    return event;
  }

  private assertRetryable(
    event: any,
  ): void {
    const retryable = [
      "failed",
      "dead",
      "rejected",
      "cancelled",
      "retrying",
      "awaiting_credentials",
    ];

    if (
      !retryable.includes(
        event.status,
      )
    ) {
      throw new ConflictException(
        `Publication cannot be retried from status "${event.status}".`,
      );
    }
  }

  private async updateWithOperation(
    input: {
      event: any;
      nextStatus: string;
      operation:
        PublicationOperation;
      details?: any;
      resetDeliveryError?: boolean;
    },
  ) {
    const now =
      new Date();

    const previousResult =
      this.objectOf(
        input.event.result,
      );

    const previousDelivery =
      this.objectOf(
        previousResult.delivery,
      );

    const operations =
      Array.isArray(
        previousResult.operations,
      )
        ? previousResult.operations
        : [];

    const delivery =
      input.resetDeliveryError
        ? {
            ...previousDelivery,
            status:
              input.nextStatus,
            errorCode:
              null,
            errorMessage:
              null,
            terminal:
              false,
            queuedAt:
              now.toISOString(),
          }
        : {
            ...previousDelivery,
            status:
              input.nextStatus,
          };

    return (this.prisma as any).platformEvent.update({
      where: {
        id:
          input.event.id,
      },

      data: {
        status:
          input.nextStatus,

        result: {
          ...previousResult,
          delivery,

          operations: [
            ...operations,

            this.operationRecord(
              input.operation,
              input.details,
              now,
            ),
          ],

          latestOperation:
            this.operationRecord(
              input.operation,
              input.details,
              now,
            ),
        },

        updatedAt:
          now,
      },
    });
  }

  private async appendOperation(
    eventId: string,
    operation:
      PublicationOperation,
    details?: any,
  ): Promise<void> {
    const event =
      await (this.prisma as any).platformEvent.findUnique({
        where: {
          id: eventId,
        },
      });

    if (!event) {
      return;
    }

    const result =
      this.objectOf(
        event.result,
      );

    const operations =
      Array.isArray(
        result.operations,
      )
        ? result.operations
        : [];

    const record =
      this.operationRecord(
        operation,
        details,
        new Date(),
      );

    await (this.prisma as any).platformEvent.update({
      where: {
        id: eventId,
      },

      data: {
        result: {
          ...result,
          operations: [
            ...operations,
            record,
          ],
          latestOperation:
            record,
        },

        updatedAt:
          new Date(),
      },
    });
  }

  private operationRecord(
    operation:
      PublicationOperation,
    details: any,
    at: Date,
  ) {
    return {
      operationId:
        randomUUID(),
      operation,
      details:
        details ?? {},
      at:
        at.toISOString(),
      source:
        "publisher-enterprise-api",
    };
  }

  private externalId(
    result: Record<string, any>,
  ): string | null {
    const delivery =
      this.objectOf(
        result.delivery,
      );

    return typeof
      delivery.externalId ===
      "string"
        ? delivery.externalId
        : null;
  }

  private async audit(
    action: string,
    entityId: string,
  ): Promise<void> {
    await this.prisma.auditLog.create({
      data: {
        action,
        entity:
          "PlatformEvent",
        entityId,
      },
    });
  }

  private supportedEventTypes():
    string[] {
    return [
      "InstagramVehiclePublicationRequested",
      "TikTokVehiclePublicationRequested",
      "GoogleSearchVehicleCampaignRequested",
    ];
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
}

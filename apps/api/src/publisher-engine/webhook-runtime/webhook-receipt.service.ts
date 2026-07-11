import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";

import { PrismaService } from "../../prisma/prisma.service";

import {
  ConnectorSecurityChannel,
} from "../connector-security/connector-credential-vault.service";

import { ConnectorWebhookVerificationService } from "../connector-security/connector-webhook-verification.service";

type ReceiptStatus =
  | "delivered"
  | "failed"
  | "rejected"
  | "cancelled"
  | "processing";

interface WebhookReceiptInput {
  channel: ConnectorSecurityChannel;
  eventId?: string;
  receiptId?: string;
  success?: boolean;
  status?: string;
  externalId?: string | null;
  externalStatus?: string | null;
  errorCode?: string | null;
  errorMessage?: string | null;
  message?: string | null;
  payload?: any;
  rawBody: string;
  signature?: string;
  receivedAt?: Date;
}

@Injectable()
export class WebhookReceiptService {
  private readonly logger =
    new Logger(
      WebhookReceiptService.name,
    );

  constructor(
    private readonly prisma: PrismaService,
    private readonly verifier: ConnectorWebhookVerificationService,
  ) {}

  async receive(
    input: WebhookReceiptInput,
  ): Promise<any> {
    const eventId =
      this.requiredText(
        input.eventId,
        "eventId",
      );

    const receiptId =
      this.requiredText(
        input.receiptId,
        "receiptId",
      );

    this.verifySignatureIfRequired(
      input,
    );

    const event =
      await (this.prisma as any).platformEvent.findUnique({
        where: {
          id: eventId,
        },
      });

    if (!event) {
      throw new NotFoundException(
        "PlatformEvent not found.",
      );
    }

    const expectedChannel =
      this.channelFromEventType(
        event.type,
      );

    if (!expectedChannel) {
      throw new BadRequestException(
        `PlatformEvent type "${event.type}" does not support social delivery receipts.`,
      );
    }

    if (
      expectedChannel !== input.channel
    ) {
      throw new BadRequestException(
        `Webhook channel mismatch. Event belongs to "${expectedChannel}", received "${input.channel}".`,
      );
    }

    const previousResult =
      this.objectOf(
        event.result,
      );

    const previousDelivery =
      this.objectOf(
        previousResult.delivery,
      );

    const existingReceipts =
      Array.isArray(
        previousResult.receipts,
      )
        ? previousResult.receipts
        : [];

    const duplicate =
      existingReceipts.find(
        (item: any) =>
          item?.receiptId ===
          receiptId,
      );

    if (duplicate) {
      return {
        success: true,
        duplicate: true,
        eventId,
        receiptId,
        channel:
          input.channel,
        status:
          event.status,
        message:
          "Receipt was already processed.",
      };
    }

    const receiptStatus =
      this.resolveStatus(
        input,
      );

    const receivedAt =
      input.receivedAt ??
      new Date();

    const receipt = {
      receiptId,
      eventId,
      channel:
        input.channel,
      status:
        receiptStatus,
      success:
        receiptStatus ===
        "delivered",
      externalId:
        this.optionalText(
          input.externalId,
        ),
      externalStatus:
        this.optionalText(
          input.externalStatus,
        ),
      errorCode:
        this.optionalText(
          input.errorCode,
        ),
      errorMessage:
        this.optionalText(
          input.errorMessage,
        ),
      message:
        this.optionalText(
          input.message,
        ),
      payload:
        input.payload ?? null,
      receivedAt:
        receivedAt.toISOString(),
    };

    const nextDelivery = {
      ...previousDelivery,
      channel:
        input.channel,
      status:
        receiptStatus,
      success:
        receiptStatus ===
        "delivered",
      externalId:
        receipt.externalId ??
        previousDelivery.externalId ??
        null,
      externalStatus:
        receipt.externalStatus,
      errorCode:
        receipt.errorCode,
      errorMessage:
        receipt.errorMessage,
      receiptId,
      webhookConfirmedAt:
        receivedAt.toISOString(),
    };

    const updated =
      await (this.prisma as any).platformEvent.update({
        where: {
          id: eventId,
        },

        data: {
          status:
            receiptStatus,

          result: {
            ...previousResult,
            delivery:
              nextDelivery,

            receipts: [
              ...existingReceipts,
              receipt,
            ],

            latestReceipt:
              receipt,
          },

          updatedAt:
            receivedAt,
        },
      });

    await this.prisma.auditLog.create({
      data: {
        action:
          this.auditAction(
            receiptStatus,
          ),
        entity:
          "PlatformEvent",
        entityId:
          eventId,
      },
    });

    this.logger.log(
      `Webhook receipt processed: channel=${input.channel}, eventId=${eventId}, receiptId=${receiptId}, status=${receiptStatus}`,
    );

    return {
      success: true,
      duplicate: false,
      eventId,
      receiptId,
      channel:
        input.channel,
      status:
        updated.status,
      externalId:
        receipt.externalId,
      receivedAt,
    };
  }

  private verifySignatureIfRequired(
    input: WebhookReceiptInput,
  ): void {
    const required =
      String(
        process.env
          .WEBHOOK_SIGNATURE_REQUIRED ??
        (
          process.env
            .PUBLISHER_DELIVERY_MODE ===
          "production"
            ? "true"
            : "false"
        ),
      ).toLowerCase() ===
      "true";

    if (!required) {
      return;
    }

    const verification =
      this.verifier.verify({
        channel:
          input.channel,
        rawBody:
          input.rawBody,
        signature:
          input.signature ?? "",
      });

    if (
      !verification.configured
    ) {
      throw new ConflictException(
        verification.reason,
      );
    }

    if (!verification.valid) {
      throw new UnauthorizedException(
        verification.reason,
      );
    }
  }

  private resolveStatus(
    input: WebhookReceiptInput,
  ): ReceiptStatus {
    const supplied =
      String(
        input.status ??
        input.externalStatus ??
        "",
      )
        .trim()
        .toLowerCase();

    switch (supplied) {
      case "delivered":
      case "published":
      case "completed":
      case "success":
      case "succeeded":
        return "delivered";

      case "rejected":
      case "declined":
        return "rejected";

      case "cancelled":
      case "canceled":
        return "cancelled";

      case "processing":
      case "pending":
        return "processing";

      case "failed":
      case "error":
        return "failed";
    }

    if (
      typeof input.success ===
      "boolean"
    ) {
      return input.success
        ? "delivered"
        : "failed";
    }

    throw new BadRequestException(
      "Receipt must include a valid status or success flag.",
    );
  }

  private channelFromEventType(
    type: string,
  ): ConnectorSecurityChannel | null {
    switch (type) {
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

  private auditAction(
    status: ReceiptStatus,
  ): string {
    switch (status) {
      case "delivered":
        return "SOCIAL_DELIVERY_CONFIRMED";

      case "rejected":
        return "SOCIAL_DELIVERY_REJECTED";

      case "cancelled":
        return "SOCIAL_DELIVERY_CANCELLED";

      case "processing":
        return "SOCIAL_DELIVERY_PROCESSING";

      default:
        return "SOCIAL_DELIVERY_FAILED";
    }
  }

  private requiredText(
    value: unknown,
    field: string,
  ): string {
    if (
      typeof value !== "string" ||
      !value.trim()
    ) {
      throw new BadRequestException(
        `${field} is required.`,
      );
    }

    return value.trim();
  }

  private optionalText(
    value: unknown,
  ): string | null {
    if (
      typeof value !== "string"
    ) {
      return null;
    }

    const normalized =
      value.trim();

    return normalized
      ? normalized
      : null;
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

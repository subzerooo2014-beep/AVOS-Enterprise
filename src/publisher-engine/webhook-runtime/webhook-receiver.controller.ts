import {
  Body,
  Controller,
  Headers,
  Param,
  Post,
} from "@nestjs/common";

import {
  ConnectorSecurityChannel,
} from "../connector-security/connector-credential-vault.service";

import { WebhookReceiptService } from "./webhook-receipt.service";

@Controller(
  "publisher-engine/webhook",
)
export class WebhookReceiverController {
  constructor(
    private readonly receipt:
      WebhookReceiptService,
  ) {}

  @Post(":channel")
  receive(
    @Param("channel")
    channel: string,

    @Body()
    body: any,

    @Headers("x-avos-signature")
    signature?: string,

    @Headers("x-avos-receipt-id")
    headerReceiptId?: string,
  ) {
    const normalizedChannel =
      this.channel(channel);

    const receiptId =
      body?.receiptId ??
      headerReceiptId ??
      null;

    /*
     * في الوضع الحالي نحسب النص من JSON المستلم.
     * عند الربط الرسمي سنستخدم Raw Body Middleware
     * لأن بعض المنصات توقع البايتات الأصلية حرفيًا.
     */
    const rawBody =
      JSON.stringify(
        body ?? {},
      );

    return this.receipt.receive({
      ...body,
      channel:
        normalizedChannel,
      receiptId,
      rawBody,
      signature:
        signature ?? "",
      receivedAt:
        new Date(),
    });
  }

  private channel(
    value: string,
  ): ConnectorSecurityChannel {
    const normalized =
      String(value)
        .trim()
        .toLowerCase();

    if (
      normalized ===
      "instagram" ||
      normalized ===
      "tiktok" ||
      normalized ===
      "google_search"
    ) {
      return normalized;
    }

    if (
      normalized ===
      "google-search"
    ) {
      return "google_search";
    }

    throw new Error(
      `Unsupported webhook channel "${normalized}".`,
    );
  }
}

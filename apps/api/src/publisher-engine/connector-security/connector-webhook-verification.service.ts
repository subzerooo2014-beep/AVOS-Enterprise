import { Injectable } from "@nestjs/common";
import {
  createHmac,
  timingSafeEqual,
} from "node:crypto";

import {
  ConnectorCredentialVaultService,
  ConnectorSecurityChannel,
} from "./connector-credential-vault.service";

@Injectable()
export class ConnectorWebhookVerificationService {
  constructor(
    private readonly vault: ConnectorCredentialVaultService,
  ) {}

  verify(input: {
    channel: ConnectorSecurityChannel;
    rawBody: string;
    signature: string;
  }) {
    const secret =
      this.vault.webhookSecret(
        input.channel,
      );

    if (!secret) {
      return {
        valid: false,
        configured: false,
        reason:
          `${input.channel} webhook secret is not configured.`,
      };
    }

    const supplied =
      this.normalizeSignature(
        input.signature,
      );

    if (!supplied) {
      return {
        valid: false,
        configured: true,
        reason:
          "Webhook signature is missing.",
      };
    }

    const expected =
      createHmac(
        "sha256",
        secret,
      )
        .update(
          input.rawBody,
          "utf8",
        )
        .digest("hex");

    const suppliedBuffer =
      Buffer.from(
        supplied,
        "hex",
      );

    const expectedBuffer =
      Buffer.from(
        expected,
        "hex",
      );

    const valid =
      suppliedBuffer.length ===
        expectedBuffer.length &&
      timingSafeEqual(
        suppliedBuffer,
        expectedBuffer,
      );

    return {
      valid,
      configured: true,
      algorithm:
        "hmac-sha256",

      reason:
        valid
          ? "Webhook signature verified."
          : "Webhook signature is invalid.",
    };
  }

  private normalizeSignature(
    value: string,
  ): string | null {
    if (
      typeof value !== "string" ||
      !value.trim()
    ) {
      return null;
    }

    const normalized =
      value
        .trim()
        .replace(
          /^sha256=/i,
          "",
        );

    return /^[a-f0-9]{64}$/i.test(
      normalized,
    )
      ? normalized.toLowerCase()
      : null;
  }
}

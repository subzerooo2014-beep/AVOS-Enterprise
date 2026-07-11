import {
  Body,
  Controller,
  Get,
  Param,
  Post,
} from "@nestjs/common";

import {
  ConnectorCredentialVaultService,
  ConnectorSecurityChannel,
} from "./connector-credential-vault.service";

import { ConnectorOAuthStateService } from "./connector-oauth-state.service";
import { ConnectorRateLimiterService } from "./connector-rate-limiter.service";
import { ConnectorWebhookVerificationService } from "./connector-webhook-verification.service";

@Controller("publisher-engine/connector-security")
export class ConnectorSecurityController {
  constructor(
    private readonly vault: ConnectorCredentialVaultService,
    private readonly oauthStates: ConnectorOAuthStateService,
    private readonly rateLimiter: ConnectorRateLimiterService,
    private readonly webhooks: ConnectorWebhookVerificationService,
  ) {}

  @Get("status")
  status() {
    const credentials =
      this.vault.allSnapshots();

    return {
      success: true,

      credentials,

      configuredCount:
        credentials.filter(
          (item) =>
            item.configured,
        ).length,

      oauth:
        this.oauthStates.status(),

      rateLimiter:
        this.rateLimiter.status(),

      generatedAt:
        new Date(),
    };
  }

  @Post("oauth/state/:channel")
  createOAuthState(
    @Param("channel")
    channel: string,

    @Body()
    body: {
      redirectUri?: string;
    },
  ) {
    const normalized =
      this.channel(channel);

    if (
      !body?.redirectUri?.trim()
    ) {
      throw new Error(
        "redirectUri is required.",
      );
    }

    return this.oauthStates.create({
      channel:
        normalized,
      redirectUri:
        body.redirectUri.trim(),
    });
  }

  @Post("oauth/consume/:channel")
  consumeOAuthState(
    @Param("channel")
    channel: string,

    @Body()
    body: {
      state?: string;
    },
  ) {
    if (!body?.state?.trim()) {
      throw new Error(
        "state is required.",
      );
    }

    return this.oauthStates.consume(
      body.state.trim(),
      this.channel(channel),
    );
  }

  @Post("rate-limit/:channel")
  rateLimit(
    @Param("channel")
    channel: string,

    @Body()
    body: {
      identity?: string;
    },
  ) {
    return this.rateLimiter.consume(
      this.channel(channel),

      body?.identity?.trim() ||
      "global",
    );
  }

  @Post("webhook/verify/:channel")
  verifyWebhook(
    @Param("channel")
    channel: string,

    @Body()
    body: {
      rawBody?: string;
      signature?: string;
    },
  ) {
    return this.webhooks.verify({
      channel:
        this.channel(channel),

      rawBody:
        body?.rawBody ?? "",

      signature:
        body?.signature ?? "",
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
      normalized === "instagram" ||
      normalized === "tiktok" ||
      normalized === "google_search"
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
      `Unsupported connector channel "${normalized}".`,
    );
  }
}

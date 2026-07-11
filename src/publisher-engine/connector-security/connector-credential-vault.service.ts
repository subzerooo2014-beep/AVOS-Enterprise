import { Injectable } from "@nestjs/common";

export type ConnectorSecurityChannel =
  | "instagram"
  | "tiktok"
  | "google_search";

export interface ConnectorCredentialSnapshot {
  channel: ConnectorSecurityChannel;
  configured: boolean;
  endpointConfigured: boolean;
  tokenConfigured: boolean;
  accountConfigured: boolean;
  webhookSecretConfigured: boolean;
}

@Injectable()
export class ConnectorCredentialVaultService {
  snapshot(
    channel: ConnectorSecurityChannel,
  ): ConnectorCredentialSnapshot {
    const endpoint =
      this.endpoint(channel);

    const token =
      this.accessToken(channel);

    const accountId =
      this.accountId(channel);

    const webhookSecret =
      this.webhookSecret(channel);

    return {
      channel,

      configured:
        Boolean(
          endpoint &&
          token &&
          accountId,
        ),

      endpointConfigured:
        Boolean(endpoint),

      tokenConfigured:
        Boolean(token),

      accountConfigured:
        Boolean(accountId),

      webhookSecretConfigured:
        Boolean(webhookSecret),
    };
  }

  allSnapshots(): ConnectorCredentialSnapshot[] {
    return [
      this.snapshot("instagram"),
      this.snapshot("tiktok"),
      this.snapshot("google_search"),
    ];
  }

  endpoint(
    channel: ConnectorSecurityChannel,
  ): string | null {
    return this.value(
      channel === "instagram"
        ? process.env.INSTAGRAM_DELIVERY_URL
        : channel === "tiktok"
          ? process.env.TIKTOK_DELIVERY_URL
          : process.env.GOOGLE_SEARCH_DELIVERY_URL,
    );
  }

  accessToken(
    channel: ConnectorSecurityChannel,
  ): string | null {
    return this.value(
      channel === "instagram"
        ? process.env.INSTAGRAM_ACCESS_TOKEN
        : channel === "tiktok"
          ? process.env.TIKTOK_ACCESS_TOKEN
          : process.env.GOOGLE_ADS_ACCESS_TOKEN,
    );
  }

  accountId(
    channel: ConnectorSecurityChannel,
  ): string | null {
    return this.value(
      channel === "instagram"
        ? process.env.INSTAGRAM_ACCOUNT_ID
        : channel === "tiktok"
          ? process.env.TIKTOK_ACCOUNT_ID
          : process.env.GOOGLE_ADS_CUSTOMER_ID,
    );
  }

  webhookSecret(
    channel: ConnectorSecurityChannel,
  ): string | null {
    return this.value(
      channel === "instagram"
        ? process.env.INSTAGRAM_WEBHOOK_SECRET
        : channel === "tiktok"
          ? process.env.TIKTOK_WEBHOOK_SECRET
          : process.env.GOOGLE_WEBHOOK_SECRET,
    );
  }

  requireAccessToken(
    channel: ConnectorSecurityChannel,
  ): string {
    const token =
      this.accessToken(channel);

    if (!token) {
      throw new Error(
        `${channel} access token is not configured.`,
      );
    }

    return token;
  }

  requireAccountId(
    channel: ConnectorSecurityChannel,
  ): string {
    const accountId =
      this.accountId(channel);

    if (!accountId) {
      throw new Error(
        `${channel} account id is not configured.`,
      );
    }

    return accountId;
  }

  private value(
    value: string | undefined,
  ): string | null {
    const normalized =
      value?.trim();

    return normalized
      ? normalized
      : null;
  }
}

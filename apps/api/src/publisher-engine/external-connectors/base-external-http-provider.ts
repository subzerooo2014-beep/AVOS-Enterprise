import { Logger } from "@nestjs/common";

import {
  ExternalProvider,
  ExternalProviderChannel,
  ExternalProviderRequest,
  ExternalProviderResponse,
} from "./external-provider.interface";

export abstract class BaseExternalHttpProvider
  implements ExternalProvider
{
  abstract readonly channel: ExternalProviderChannel;

  protected abstract readonly logger: Logger;

  protected abstract endpoint(): string | null;
  protected abstract accessToken(): string | null;
  protected abstract accountId(): string | null;

  configured(): boolean {
    return Boolean(this.endpoint());
  }

  async health(): Promise<{
    channel: ExternalProviderChannel;
    configured: boolean;
    status:
      | "healthy"
      | "unconfigured"
      | "degraded";
  }> {
    const configured =
      this.configured();

    return {
      channel: this.channel,
      configured,
      status:
        configured
          ? "healthy"
          : "unconfigured",
    };
  }

  async deliver(
    request: ExternalProviderRequest,
  ): Promise<ExternalProviderResponse> {
    const endpoint =
      this.endpoint();

    if (!endpoint) {
      return {
        success: false,
        channel: this.channel,
        configured: false,
        status:
          "awaiting_credentials",
        message:
          `${this.channel} delivery endpoint is not configured.`,
      };
    }

    const controller =
      new AbortController();

    const timeout = setTimeout(
      () => controller.abort(),
      this.timeoutMs(),
    );

    timeout.unref?.();

    try {
      const headers: Record<string, string> = {
        "Content-Type":
          "application/json",
        "X-AVOS-Event-ID":
          request.eventId,
        "X-AVOS-Channel":
          this.channel,
        "X-AVOS-Attempt":
          String(request.attempt),
      };

      const token =
        this.accessToken();

      if (token) {
        headers.Authorization =
          `Bearer ${token}`;
      }

      const accountId =
        this.accountId();

      if (accountId) {
        headers["X-AVOS-Account-ID"] =
          accountId;
      }

      const response = await fetch(
        endpoint,
        {
          method: "POST",
          headers,
          signal:
            controller.signal,

          body: JSON.stringify(
            this.buildRequestBody(
              request,
              accountId,
            ),
          ),
        },
      );

      const responseBody =
        await this.parseResponse(
          response,
        );

      if (!response.ok) {
        throw new Error(
          `${this.channel} API returned HTTP ${response.status}: ${this.safeString(
            responseBody,
          )}`,
        );
      }

      const externalId =
        this.externalId(
          responseBody,
        ) ??
        response.headers.get(
          "x-external-id",
        ) ??
        null;

      this.logger.log(
        `External delivery completed: channel=${this.channel}, eventId=${request.eventId}, externalId=${String(
          externalId ?? "none",
        )}`,
      );

      return {
        success: true,
        channel: this.channel,
        configured: true,
        status: "delivered",
        externalId,
        message:
          `${this.channel} delivery completed.`,
        response: responseBody,
      };
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : String(error);

      this.logger.warn(
        `External delivery failed: channel=${this.channel}, eventId=${request.eventId}, error=${message}`,
      );

      return {
        success: false,
        channel: this.channel,
        configured: true,
        status: "retrying",
        message,
      };
    } finally {
      clearTimeout(timeout);
    }
  }

  protected buildRequestBody(
    request: ExternalProviderRequest,
    accountId: string | null,
  ): any {
    return {
      eventId: request.eventId,
      channel: this.channel,
      accountId,
      attempt: request.attempt,
      payload: request.payload,
    };
  }

  private timeoutMs(): number {
    const value = Number(
      process.env
        .SOCIAL_DELIVERY_TIMEOUT_MS,
    );

    return Number.isInteger(value) &&
      value > 0
      ? value
      : 20_000;
  }

  private async parseResponse(
    response: Response,
  ): Promise<any> {
    const text =
      await response.text();

    if (!text) {
      return null;
    }

    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  }

  private externalId(
    body: any,
  ): string | null {
    const value =
      body?.externalId ??
      body?.id ??
      body?.data?.id ??
      body?.result?.id ??
      body?.media_id ??
      body?.post_id ??
      body?.campaign_id ??
      null;

    if (
      typeof value !== "string" &&
      typeof value !== "number"
    ) {
      return null;
    }

    return String(value);
  }

  private safeString(
    value: any,
  ): string {
    if (
      typeof value === "string"
    ) {
      return value.slice(0, 1000);
    }

    try {
      return JSON.stringify(value)
        .slice(0, 1000);
    } catch {
      return String(value)
        .slice(0, 1000);
    }
  }
}

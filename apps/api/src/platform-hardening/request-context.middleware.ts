import {
  Injectable,
  NestMiddleware,
} from "@nestjs/common";

import {
  randomUUID,
} from "node:crypto";

export type AvosHeaderValue =
  | string
  | string[]
  | undefined;

export interface AvosRequest {
  method?: string;
  url?: string;
  originalUrl?: string;

  headers?: Record<
    string,
    AvosHeaderValue
  >;

  requestId?: string;
  requestStartedAt?: number;
}

export interface AvosResponse {
  setHeader(
    name: string,
    value: string | number,
  ): void;

  removeHeader(
    name: string,
  ): void;
}

export type AvosNextFunction =
  () => void;

@Injectable()
export class RequestContextMiddleware
  implements NestMiddleware
{
  use(
    request: AvosRequest,
    response: AvosResponse,
    next: AvosNextFunction,
  ): void {
    const incomingRequestId =
      this.headerValue(
        request,
        "x-request-id",
      ) ??
      this.headerValue(
        request,
        "x-correlation-id",
      );

    const requestId =
      this.normalizeRequestId(
        incomingRequestId,
      ) ??
      randomUUID();

    request.requestId =
      requestId;

    request.requestStartedAt =
      Date.now();

    response.setHeader(
      "x-request-id",
      requestId,
    );

    response.setHeader(
      "x-avos-request-id",
      requestId,
    );

    next();
  }

  private headerValue(
    request: AvosRequest,
    name: string,
  ): string | undefined {
    const headers =
      request.headers ??
      {};

    const value =
      headers[name] ??
      headers[
        name.toLowerCase()
      ];

    if (
      Array.isArray(value)
    ) {
      return value[0];
    }

    return typeof value ===
      "string"
      ? value
      : undefined;
  }

  private normalizeRequestId(
    value: string | undefined,
  ): string | null {
    if (
      typeof value !==
      "string"
    ) {
      return null;
    }

    const normalized =
      value
        .trim()
        .slice(
          0,
          128,
        );

    if (
      !normalized ||
      !/^[a-zA-Z0-9._:-]+$/.test(
        normalized,
      )
    ) {
      return null;
    }

    return normalized;
  }
}

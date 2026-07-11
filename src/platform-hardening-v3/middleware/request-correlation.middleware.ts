import {
  Injectable,
  NestMiddleware,
} from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { RequestContextService } from "../services/request-context.service";

interface HttpRequestLike {
  method: string;
  originalUrl?: string;
  url?: string;
  ip?: string;
  headers: Record<
    string,
    string | string[] | undefined
  >;
}

interface HttpResponseLike {
  setHeader(
    name: string,
    value: string,
  ): void;
}

type NextFunctionLike = () => void;

@Injectable()
export class RequestCorrelationMiddleware
  implements NestMiddleware
{
  constructor(
    private readonly requestContext:
      RequestContextService,
  ) {}

  use(
    request: HttpRequestLike,
    response: HttpResponseLike,
    next: NextFunctionLike,
  ): void {
    const incomingCorrelationId =
      this.readHeader(
        request.headers["x-correlation-id"],
      );

    const incomingTraceId =
      this.readHeader(
        request.headers["x-trace-id"],
      );

    const correlationId =
      incomingCorrelationId ?? randomUUID();

    const traceId =
      incomingTraceId ?? correlationId;

    const requestId = randomUUID();

    response.setHeader(
      "x-correlation-id",
      correlationId,
    );

    response.setHeader(
      "x-trace-id",
      traceId,
    );

    response.setHeader(
      "x-request-id",
      requestId,
    );

    const context = {
      correlationId,
      traceId,
      requestId,
      method: request.method,
      path:
        request.originalUrl ??
        request.url ??
        "/",
      ip: request.ip,
      userAgent:
        this.readHeader(
          request.headers["user-agent"],
        ),
      startedAt: Date.now(),
    };

    this.requestContext.run(
      context,
      () => next(),
    );
  }

  private readHeader(
    value:
      | string
      | string[]
      | undefined,
  ): string | undefined {
    if (Array.isArray(value)) {
      return value[0]?.trim() || undefined;
    }

    return value?.trim() || undefined;
  }
}

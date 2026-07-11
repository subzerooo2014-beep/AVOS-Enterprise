import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Observable, tap } from "rxjs";
import { RequestMetricsService } from "../services/request-metrics.service";
import { RequestContextService } from "../services/request-context.service";
import { StructuredLoggerService } from "../services/structured-logger.service";

@Injectable()
export class RequestObservabilityInterceptor
  implements NestInterceptor
{
  private readonly slowRequestThresholdMs =
    this.readSlowRequestThreshold();

  constructor(
    private readonly context:
      RequestContextService,
    private readonly metrics:
      RequestMetricsService,
    private readonly logger:
      StructuredLoggerService,
  ) {}

  intercept(
    executionContext: ExecutionContext,
    next: CallHandler,
  ): Observable<unknown> {
    const request =
      executionContext.switchToHttp().getRequest<any>();

    const response =
      executionContext.switchToHttp().getResponse<any>();

    const requestContext = this.context.get();

    const startedAt =
      requestContext?.startedAt ?? Date.now();

    this.logger.info(
      "http.request.started",
      `${request.method} ${request.originalUrl ?? request.url}`,
      {
        ip: request.ip,
        userAgent:
          request.headers?.["user-agent"],
      },
    );

    return next.handle().pipe(
      tap({
        next: () => {
          this.complete(
            request,
            response,
            startedAt,
            true,
          );
        },
      }),
    );
  }

  private complete(
    request: any,
    response: any,
    startedAt: number,
    success: boolean,
  ): void {
    const context = this.context.get();

    const durationMs = Number(
      (Date.now() - startedAt).toFixed(3),
    );

    const statusCode =
      Number(response.statusCode) || 200;

    const slow =
      durationMs >= this.slowRequestThresholdMs;

    this.metrics.record({
      correlationId:
        context?.correlationId ?? "unknown",
      traceId: context?.traceId ?? "unknown",
      method: request.method,
      path:
        request.originalUrl ??
        request.url ??
        "unknown",
      statusCode,
      durationMs,
      success:
        success &&
        statusCode >= 200 &&
        statusCode < 400,
      slow,
      timestamp: new Date().toISOString(),
    });

    const metadata = {
      statusCode,
      durationMs,
      slow,
      slowRequestThresholdMs:
        this.slowRequestThresholdMs,
    };

    if (slow) {
      this.logger.warn(
        "http.request.slow",
        `${request.method} ${request.originalUrl ?? request.url} completed slowly`,
        metadata,
      );

      return;
    }

    this.logger.info(
      "http.request.completed",
      `${request.method} ${request.originalUrl ?? request.url} completed`,
      metadata,
    );
  }

  private readSlowRequestThreshold(): number {
    const configured = Number(
      process.env.AVOS_SLOW_REQUEST_THRESHOLD_MS,
    );

    if (
      Number.isFinite(configured) &&
      configured >= 1
    ) {
      return configured;
    }

    return 750;
  }
}

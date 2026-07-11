import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from "@nestjs/common";
import { RequestMetricsService } from "../services/request-metrics.service";
import { ErrorClassificationService } from "../services/error-classification.service";
import { FailureFingerprintService } from "../services/failure-fingerprint.service";
import { IncidentRegistryService } from "../services/incident-registry.service";
import { RequestContextService } from "../services/request-context.service";
import { StructuredLoggerService } from "../services/structured-logger.service";

@Catch()
export class GlobalObservabilityExceptionFilter
  implements ExceptionFilter
{
  constructor(
    private readonly context:
      RequestContextService,
    private readonly classificationService:
      ErrorClassificationService,
    private readonly fingerprints:
      FailureFingerprintService,
    private readonly incidents:
      IncidentRegistryService,
    private readonly metrics:
      RequestMetricsService,
    private readonly logger:
      StructuredLoggerService,
  ) {}

  catch(
    exception: unknown,
    host: ArgumentsHost,
  ): void {
    const http = host.switchToHttp();

    const request = http.getRequest<any>();
    const response = http.getResponse<any>();

    const context = this.context.get();

    const classification =
      this.classificationService.classify(
        exception,
      );

    const message =
      this.extractMessage(exception);

    const fingerprint =
      this.fingerprints.create({
        error: exception,
        classification,
        method: request.method,
        path:
          request.originalUrl ??
          request.url,
      });

    const incident = this.incidents.register({
      fingerprint,
      title: `${classification.category} failure`,
      message,
      classification,
      correlationId:
        context?.correlationId,
      traceId: context?.traceId,
      method: request.method,
      path:
        request.originalUrl ??
        request.url,
      metadata: {
        retryable:
          classification.retryable,
        operational:
          classification.operational,
        errorName:
          exception instanceof Error
            ? exception.name
            : typeof exception,
      },
    });

    const durationMs = Number(
      (
        Date.now() -
        (context?.startedAt ?? Date.now())
      ).toFixed(3),
    );

    this.metrics.record({
      correlationId:
        context?.correlationId ?? "unknown",
      traceId:
        context?.traceId ?? "unknown",
      method: request.method,
      path:
        request.originalUrl ??
        request.url ??
        "unknown",
      statusCode:
        classification.statusCode,
      durationMs,
      success: false,
      slow:
        durationMs >=
        Number(
          process.env
            .AVOS_SLOW_REQUEST_THRESHOLD_MS ??
            750,
        ),
      timestamp: new Date().toISOString(),
    });

    this.logger.error(
      "http.request.failed",
      message,
      {
        fingerprint,
        incidentId: incident.id,
        category:
          classification.category,
        severity:
          classification.severity,
        statusCode:
          classification.statusCode,
        retryable:
          classification.retryable,
        durationMs,
      },
    );

    response
      .status(classification.statusCode)
      .json({
        success: false,
        statusCode:
          classification.statusCode,
        error:
          classification.category,
        message,
        correlationId:
          context?.correlationId,
        traceId: context?.traceId,
        incidentReference:
          incident.id,
        timestamp:
          new Date().toISOString(),
        path:
          request.originalUrl ??
          request.url,
      });
  }

  private extractMessage(
    exception: unknown,
  ): string {
    if (exception instanceof HttpException) {
      const response = exception.getResponse();

      if (typeof response === "string") {
        return response;
      }

      if (
        typeof response === "object" &&
        response !== null &&
        "message" in response
      ) {
        const message = (
          response as {
            message?: unknown;
          }
        ).message;

        if (Array.isArray(message)) {
          return message.join(", ");
        }

        if (message) {
          return String(message);
        }
      }
    }

    if (exception instanceof Error) {
      return exception.message;
    }

    return "Unexpected platform failure";
  }
}

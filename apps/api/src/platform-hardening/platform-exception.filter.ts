import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";

import {
  AvosRequest,
} from "./request-context.middleware";

interface ExceptionResponse {
  status(
    statusCode: number,
  ): ExceptionResponse;

  json(
    body: unknown,
  ): void;
}

interface ErrorDetails {
  code: string;
  message: string;
  details: unknown;
}

@Catch()
export class PlatformExceptionFilter
  implements ExceptionFilter
{
  private readonly logger =
    new Logger(
      PlatformExceptionFilter.name,
    );

  catch(
    exception: unknown,
    host: ArgumentsHost,
  ): void {
    const context =
      host.switchToHttp();

    const response =
      context.getResponse<
        ExceptionResponse
      >();

    const request =
      context.getRequest<
        AvosRequest
      >();

    const statusCode =
      this.statusCode(
        exception,
      );

    const details =
      this.details(
        exception,
      );

    const requestId =
      request.requestId ??
      "unknown";

    const durationMs =
      typeof request
        .requestStartedAt ===
      "number"
        ? Math.max(
            0,
            Date.now() -
            request.requestStartedAt,
          )
        : null;

    const method =
      request.method ??
      "UNKNOWN";

    const path =
      request.originalUrl ??
      request.url ??
      "unknown";

    const logMessage =
      [
        `requestId=${requestId}`,
        `method=${method}`,
        `path=${path}`,
        `status=${statusCode}`,
        `message=${details.message}`,
      ].join(" ");

    if (
      statusCode >= 500
    ) {
      this.logger.error(
        logMessage,
        exception instanceof Error
          ? exception.stack
          : undefined,
      );
    } else {
      this.logger.warn(
        logMessage,
      );
    }

    response
      .status(statusCode)
      .json({
        success: false,

        error: {
          code:
            details.code,

          message:
            details.message,

          details:
            details.details,
        },

        request: {
          requestId,
          method,
          path,
          durationMs,
        },

        timestamp:
          new Date()
            .toISOString(),
      });
  }

  private statusCode(
    exception: unknown,
  ): number {
    if (
      exception instanceof
      HttpException
    ) {
      return exception.getStatus();
    }

    const error =
      exception as {
        code?: unknown;
      };

    const prismaCode =
      String(
        error?.code ??
        "",
      );

    switch (prismaCode) {
      case "P2002":
        return HttpStatus.CONFLICT;

      case "P2025":
        return HttpStatus.NOT_FOUND;

      case "P2003":
        return HttpStatus.BAD_REQUEST;

      case "P1001":
      case "P1002":
      case "P2024":
        return HttpStatus.SERVICE_UNAVAILABLE;

      default:
        return HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }

  private details(
    exception: unknown,
  ): ErrorDetails {
    if (
      exception instanceof
      HttpException
    ) {
      const exceptionResponse =
        exception.getResponse();

      if (
        typeof exceptionResponse ===
        "string"
      ) {
        return {
          code:
            this.httpCode(
              exception.getStatus(),
            ),

          message:
            exceptionResponse,

          details:
            null,
        };
      }

      const body =
        exceptionResponse as {
          error?: unknown;
          message?: unknown;
          details?: unknown;
        };

      const messages =
        Array.isArray(
          body?.message,
        )
          ? body.message.map(
              (item) =>
                String(item),
            )
          : null;

      return {
        code:
          String(
            body?.error ??
            this.httpCode(
              exception.getStatus(),
            ),
          )
            .trim()
            .toUpperCase()
            .replace(
              /\s+/g,
              "_",
            ),

        message:
          messages
            ? messages.join(
                "; ",
              )
            : String(
                body?.message ??
                exception.message,
              ),

        details:
          messages
            ? {
                validationErrors:
                  messages,
              }
            : body?.details ??
              null,
      };
    }

    const error =
      exception as {
        code?: unknown;
        message?: unknown;
      };

    const prismaCode =
      String(
        error?.code ??
        "",
      );

    if (prismaCode) {
      return {
        code:
          prismaCode,

        message:
          this.prismaMessage(
            prismaCode,
          ),

        details:
          this.isProduction()
            ? null
            : {
                originalMessage:
                  String(
                    error?.message ??
                    "",
                  ),
              },
      };
    }

    return {
      code:
        "INTERNAL_SERVER_ERROR",

      message:
        this.isProduction()
          ? "An internal server error occurred."
          : exception instanceof
              Error
            ? exception.message
            : "Unknown internal error.",

      details:
        null,
    };
  }

  private prismaMessage(
    code: string,
  ): string {
    switch (code) {
      case "P2002":
        return "A record with the same unique value already exists.";

      case "P2025":
        return "The requested database record was not found.";

      case "P2003":
        return "The operation violates a database relationship.";

      case "P1001":
      case "P1002":
      case "P2024":
        return "The database is temporarily unavailable.";

      default:
        return "A database operation failed.";
    }
  }

  private httpCode(
    status: number,
  ): string {
    switch (status) {
      case 400:
        return "BAD_REQUEST";

      case 401:
        return "UNAUTHORIZED";

      case 403:
        return "FORBIDDEN";

      case 404:
        return "NOT_FOUND";

      case 409:
        return "CONFLICT";

      case 422:
        return "UNPROCESSABLE_ENTITY";

      case 429:
        return "TOO_MANY_REQUESTS";

      case 503:
        return "SERVICE_UNAVAILABLE";

      default:
        return status >= 500
          ? "INTERNAL_SERVER_ERROR"
          : "HTTP_ERROR";
    }
  }

  private isProduction():
    boolean {
    return String(
      process.env.NODE_ENV ??
      "development",
    ).toLowerCase() ===
      "production";
  }
}

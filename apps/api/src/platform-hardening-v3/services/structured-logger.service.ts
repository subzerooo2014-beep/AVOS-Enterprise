import { Injectable } from "@nestjs/common";
import { RequestContextService } from "./request-context.service";

type StructuredLogLevel =
  | "debug"
  | "info"
  | "warn"
  | "error";

@Injectable()
export class StructuredLoggerService {
  constructor(
    private readonly requestContext:
      RequestContextService,
  ) {}

  debug(
    event: string,
    message: string,
    metadata?: Record<string, unknown>,
  ): void {
    this.write("debug", event, message, metadata);
  }

  info(
    event: string,
    message: string,
    metadata?: Record<string, unknown>,
  ): void {
    this.write("info", event, message, metadata);
  }

  warn(
    event: string,
    message: string,
    metadata?: Record<string, unknown>,
  ): void {
    this.write("warn", event, message, metadata);
  }

  error(
    event: string,
    message: string,
    metadata?: Record<string, unknown>,
  ): void {
    this.write("error", event, message, metadata);
  }

  private write(
    level: StructuredLogLevel,
    event: string,
    message: string,
    metadata?: Record<string, unknown>,
  ): void {
    const context = this.requestContext.get();

    const payload = {
      timestamp: new Date().toISOString(),
      level,
      system: "AVOS Enterprise Production",
      component: "Production Hardening V3",
      event,
      message,
      correlationId: context?.correlationId,
      traceId: context?.traceId,
      requestId: context?.requestId,
      method: context?.method,
      path: context?.path,
      metadata: metadata ?? {},
    };

    const serialized = JSON.stringify(payload);

    if (level === "error") {
      console.error(serialized);
      return;
    }

    if (level === "warn") {
      console.warn(serialized);
      return;
    }

    console.log(serialized);
  }
}

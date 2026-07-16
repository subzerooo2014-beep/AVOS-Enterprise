import { Injectable } from "@nestjs/common";
import type { StructuredLogRecord } from "./reliability-observability.types";

@Injectable()
export class StructuredLoggingService {
  private readonly logs: StructuredLogRecord[] = [];

  write(
    level: StructuredLogRecord["level"],
    message: string,
    service: string,
    metadata: Record<string, unknown> = {},
    correlationId?: string,
    traceId?: string,
  ): StructuredLogRecord {
    const log: StructuredLogRecord = {
      id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      level,
      message,
      service,
      correlationId,
      traceId,
      metadata: { ...metadata },
      createdAt: new Date().toISOString(),
    };

    this.logs.unshift(log);

    if (this.logs.length > 5000) {
      this.logs.length = 5000;
    }

    return this.clone(log);
  }

  list(service?: string): StructuredLogRecord[] {
    return this.logs
      .filter((log) => (service ? log.service === service : true))
      .map((log) => this.clone(log));
  }

  byCorrelationId(correlationId: string): StructuredLogRecord[] {
    return this.logs
      .filter((log) => log.correlationId === correlationId)
      .map((log) => this.clone(log));
  }

  count(): number {
    return this.logs.length;
  }

  private clone(log: StructuredLogRecord): StructuredLogRecord {
    return {
      ...log,
      metadata: { ...log.metadata },
    };
  }
}

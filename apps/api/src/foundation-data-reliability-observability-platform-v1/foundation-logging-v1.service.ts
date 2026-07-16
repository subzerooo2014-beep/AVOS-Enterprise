import { Injectable } from "@nestjs/common";
import type { FoundationLogRecordV1 } from "./foundation-data-reliability-observability-v1.types";

@Injectable()
export class FoundationLoggingV1Service {
  private readonly logs: FoundationLogRecordV1[] = [];

  write(
    level: FoundationLogRecordV1["level"],
    message: string,
    context: Record<string, unknown> = {},
  ): FoundationLogRecordV1 {
    const record: FoundationLogRecordV1 = {
      id: `foundation-log-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      level,
      message,
      context: { ...context },
      createdAt: new Date().toISOString(),
    };

    this.logs.unshift(record);
    return this.clone(record);
  }

  list(): FoundationLogRecordV1[] {
    return this.logs.map((item) => this.clone(item));
  }

  count(): number {
    return this.logs.length;
  }

  errorCount(): number {
    return this.logs.filter((item) => item.level === "ERROR").length;
  }

  private clone(item: FoundationLogRecordV1): FoundationLogRecordV1 {
    return { ...item, context: { ...item.context } };
  }
}

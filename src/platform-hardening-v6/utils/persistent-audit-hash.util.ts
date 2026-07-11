import { createHash } from "node:crypto";

export class PersistentAuditHashUtil {
  static create(input: {
    sequence: number;
    eventType: string;
    severity: string;
    action: string;
    message: string;
    actor?: string | null;
    correlationId?: string | null;
    traceId?: string | null;
    method?: string | null;
    path?: string | null;
    statusCode?: number | null;
    metadata?: unknown;
    previousHash: string;
    createdAt: Date | string;
  }): string {
    const createdAt =
      input.createdAt instanceof Date
        ? input.createdAt.toISOString()
        : input.createdAt;

    const payload = JSON.stringify({
      sequence: input.sequence,
      eventType: input.eventType,
      severity: input.severity,
      action: input.action,
      message: input.message,
      actor: input.actor ?? null,
      correlationId: input.correlationId ?? null,
      traceId: input.traceId ?? null,
      method: input.method ?? null,
      path: input.path ?? null,
      statusCode: input.statusCode ?? null,
      metadata: input.metadata ?? {},
      previousHash: input.previousHash,
      createdAt,
    });

    return createHash("sha256")
      .update(payload)
      .digest("hex");
  }
}

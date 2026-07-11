import { createHash } from "node:crypto";

export class AuditHashUtil {
  static createHash(input: {
    sequence: number;
    type: string;
    severity: string;
    action: string;
    message: string;
    actor?: string;
    correlationId?: string;
    traceId?: string;
    method?: string;
    path?: string;
    statusCode?: number;
    metadata?: Record<string, unknown>;
    previousHash: string;
    createdAt: string;
  }): string {
    const payload = JSON.stringify({
      sequence: input.sequence,
      type: input.type,
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
      createdAt: input.createdAt,
    });

    return createHash("sha256")
      .update(payload)
      .digest("hex");
  }
}

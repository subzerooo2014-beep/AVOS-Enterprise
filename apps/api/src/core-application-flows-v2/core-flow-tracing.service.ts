import { Injectable, NotFoundException } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { CoreFlowDurableStoreService } from "./core-flow-durable-store.service";

@Injectable()
export class CoreFlowTracingService {
  constructor(private readonly store: CoreFlowDurableStoreService) {}

  async start(dto: any) {
    const id = randomUUID();
    const traceId = String(dto?.traceId ?? randomUUID());
    const startedAt = new Date();

    await this.store.execute(
      `INSERT INTO "avos_core_flow_trace_span"
       ("id","trace_id","parent_span_id","execution_id","flow","operation","started_at","status")
       VALUES ($1,$2,$3,$4,$5,$6,$7,'running')`,
      id,
      traceId,
      dto?.parentSpanId ?? null,
      dto?.executionId ?? null,
      String(dto?.flow ?? "unknown"),
      String(dto?.operation ?? "operation"),
      startedAt,
    );

    return { id, traceId, startedAt: startedAt.toISOString(), status: "running" };
  }

  async finish(id: string, status: "completed" | "failed" = "completed") {
    const rows = await this.store.query<any>(
      `SELECT * FROM "avos_core_flow_trace_span" WHERE "id"=$1`,
      id,
    );
    const span = rows[0];
    if (!span) throw new NotFoundException("Trace span not found");

    const endedAt = new Date();
    const durationMs = endedAt.getTime() - new Date(span.started_at).getTime();

    await this.store.execute(
      `UPDATE "avos_core_flow_trace_span"
       SET "ended_at"=$2,"duration_ms"=$3,"status"=$4
       WHERE "id"=$1`,
      id,
      endedAt,
      durationMs,
      status,
    );

    return { id, status, durationMs, endedAt: endedAt.toISOString() };
  }

  async trace(traceId: string) {
    return this.store.query<any>(
      `SELECT * FROM "avos_core_flow_trace_span"
       WHERE "trace_id"=$1 ORDER BY "started_at" ASC`,
      traceId,
    );
  }
}

import { Injectable, NotFoundException } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { CoreFlowDurableStoreService } from "./core-flow-durable-store.service";
import { CoreFlowIdempotencyService } from "./core-flow-idempotency.service";

@Injectable()
export class CoreFlowDurableRuntimeService {
  constructor(
    private readonly store: CoreFlowDurableStoreService,
    private readonly idempotency: CoreFlowIdempotencyService,
  ) {}

  async enqueue(dto: any) {
    const id = randomUUID();
    const correlationId = String(dto?.correlationId ?? `${dto?.flow}:${id}`);

    return this.idempotency.executeOnce(correlationId, async () => {
      await this.store.execute(
        `INSERT INTO "avos_core_flow_execution"
         ("id","flow","correlation_id","payload_json","status","attempts","max_attempts","next_attempt_at")
         VALUES ($1,$2,$3,$4,'queued',0,$5,$6)`,
        id,
        String(dto?.flow ?? "unknown"),
        correlationId,
        JSON.stringify(dto?.payload ?? {}),
        Math.max(Number(dto?.maxAttempts ?? 5), 1),
        dto?.nextAttemptAt ? new Date(dto.nextAttemptAt) : new Date(),
      );
      return this.findOne(id);
    });
  }

  async findAll(status?: string) {
    const rows = status
      ? await this.store.query<any>(
          `SELECT * FROM "avos_core_flow_execution" WHERE "status" = $1 ORDER BY "created_at" DESC`,
          status,
        )
      : await this.store.query<any>(
          `SELECT * FROM "avos_core_flow_execution" ORDER BY "created_at" DESC`,
        );
    return rows.map((row) => this.mapExecution(row));
  }

  async findOne(id: string) {
    const rows = await this.store.query<any>(
      `SELECT * FROM "avos_core_flow_execution" WHERE "id" = $1`,
      id,
    );
    if (!rows[0]) throw new NotFoundException("Durable execution not found");
    return this.mapExecution(rows[0]);
  }

  async acquire(id: string, workerId: string, ttlMs = 60_000) {
    const lockedUntil = new Date(Date.now() + ttlMs);
    const updated = await this.store.execute(
      `UPDATE "avos_core_flow_execution"
       SET "locked_by"=$2,"locked_until"=$3,"status"='running',"updated_at"=CURRENT_TIMESTAMP
       WHERE "id"=$1
       AND ("locked_until" IS NULL OR "locked_until" < CURRENT_TIMESTAMP)
       AND "status" IN ('queued','failed')`,
      id,
      workerId,
      lockedUntil,
    );
    return { acquired: updated > 0, execution: updated > 0 ? await this.findOne(id) : null };
  }

  async checkpoint(id: string, name: string, state: Record<string, unknown>) {
    const checkpointId = randomUUID();
    await this.findOne(id);
    await this.store.execute(
      `INSERT INTO "avos_core_flow_checkpoint" ("id","execution_id","name","state_json")
       VALUES ($1,$2,$3,$4)`,
      checkpointId,
      id,
      name,
      JSON.stringify(state),
    );
    return { id: checkpointId, executionId: id, name, state };
  }

  async complete(id: string, result: unknown) {
    await this.checkpoint(id, "completed", { result });
    await this.store.execute(
      `UPDATE "avos_core_flow_execution"
       SET "status"='completed',"locked_by"=NULL,"locked_until"=NULL,"updated_at"=CURRENT_TIMESTAMP
       WHERE "id"=$1`,
      id,
    );
    return this.findOne(id);
  }

  async fail(id: string, error: unknown) {
    const execution = await this.findOne(id);
    const attempts = execution.attempts + 1;
    const deadLettered = attempts >= execution.maxAttempts;
    const nextAttemptAt = new Date(Date.now() + Math.min(60_000 * attempts, 900_000));

    await this.store.execute(
      `UPDATE "avos_core_flow_execution"
       SET "status"=$2,"attempts"=$3,"last_error"=$4,"next_attempt_at"=$5,
           "locked_by"=NULL,"locked_until"=NULL,"updated_at"=CURRENT_TIMESTAMP
       WHERE "id"=$1`,
      id,
      deadLettered ? "dead-lettered" : "failed",
      attempts,
      error instanceof Error ? error.message : String(error),
      nextAttemptAt,
    );
    return this.findOne(id);
  }

  async recoverStaleLocks() {
    const count = await this.store.execute(
      `UPDATE "avos_core_flow_execution"
       SET "status"='queued',"locked_by"=NULL,"locked_until"=NULL,"updated_at"=CURRENT_TIMESTAMP
       WHERE "status"='running' AND "locked_until" < CURRENT_TIMESTAMP`,
    );
    return { recovered: count, recoveredAt: new Date().toISOString() };
  }

  async schedule(id: string, executeAt: string) {
    const scheduleId = randomUUID();
    await this.findOne(id);
    await this.store.execute(
      `INSERT INTO "avos_core_flow_schedule" ("id","execution_id","execute_at","status")
       VALUES ($1,$2,$3,'scheduled')`,
      scheduleId,
      id,
      new Date(executeAt),
    );
    return { id: scheduleId, executionId: id, executeAt, status: "scheduled" };
  }

  async dispatchDue() {
    const rows = await this.store.query<any>(
      `SELECT * FROM "avos_core_flow_schedule"
       WHERE "status"='scheduled' AND "execute_at" <= CURRENT_TIMESTAMP`,
    );
    for (const row of rows) {
      await this.store.transaction(async (tx) => {
        await tx.$executeRawUnsafe(
          `UPDATE "avos_core_flow_schedule" SET "status"='dispatched' WHERE "id"=$1`,
          row.id,
        );
        await tx.$executeRawUnsafe(
          `UPDATE "avos_core_flow_execution"
           SET "status"='queued',"next_attempt_at"=CURRENT_TIMESTAMP,"updated_at"=CURRENT_TIMESTAMP
           WHERE "id"=$1`,
          row.execution_id,
        );
      });
    }
    return { dispatched: rows.length, dispatchedAt: new Date().toISOString() };
  }

  async dashboard() {
    const rows = await this.store.query<any>(
      `SELECT "status", COUNT(*)::int AS "count"
       FROM "avos_core_flow_execution" GROUP BY "status"`,
    );
    const counts = Object.fromEntries(rows.map((row) => [row.status, Number(row.count)]));
    return {
      queued: counts.queued ?? 0,
      running: counts.running ?? 0,
      completed: counts.completed ?? 0,
      failed: counts.failed ?? 0,
      deadLettered: counts["dead-lettered"] ?? 0,
      generatedAt: new Date().toISOString(),
    };
  }

  private mapExecution(row: any) {
    return {
      id: row.id,
      flow: row.flow,
      correlationId: row.correlation_id,
      payload: JSON.parse(row.payload_json),
      status: row.status,
      attempts: Number(row.attempts),
      maxAttempts: Number(row.max_attempts),
      nextAttemptAt: row.next_attempt_at,
      lockedBy: row.locked_by,
      lockedUntil: row.locked_until,
      lastError: row.last_error,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}

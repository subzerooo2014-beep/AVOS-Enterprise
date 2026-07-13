import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { CoreFlowDurableStoreService } from "./core-flow-durable-store.service";

@Injectable()
export class CoreFlowDurableMessagingService {
  constructor(private readonly store: CoreFlowDurableStoreService) {}

  async enqueueOutbox(topic: string, payload: unknown) {
    const id = randomUUID();
    await this.store.execute(
      `INSERT INTO "avos_core_flow_outbox_v2"
       ("id","topic","payload_json","status","next_attempt_at")
       VALUES ($1,$2,$3,'pending',CURRENT_TIMESTAMP)`,
      id,
      topic,
      JSON.stringify(payload),
    );
    return { id, topic, payload, status: "pending" };
  }

  async acceptInbox(source: string, messageKey: string, payload: unknown) {
    const id = randomUUID();
    await this.store.execute(
      `INSERT INTO "avos_core_flow_inbox_v2"
       ("id","source","message_key","payload_json","status")
       VALUES ($1,$2,$3,$4,'pending')
       ON CONFLICT ("source","message_key") DO NOTHING`,
      id,
      source,
      messageKey,
      JSON.stringify(payload),
    );
    return { id, source, messageKey, payload, accepted: true };
  }

  async pendingOutbox(limit = 50) {
    return this.store.query<any>(
      `SELECT * FROM "avos_core_flow_outbox_v2"
       WHERE "status" IN ('pending','failed')
       AND ("next_attempt_at" IS NULL OR "next_attempt_at" <= CURRENT_TIMESTAMP)
       ORDER BY "created_at" ASC LIMIT $1`,
      Math.max(Number(limit), 1),
    );
  }

  async markPublished(id: string) {
    await this.store.execute(
      `UPDATE "avos_core_flow_outbox_v2"
       SET "status"='published',"published_at"=CURRENT_TIMESTAMP
       WHERE "id"=$1`,
      id,
    );
    return { id, status: "published" };
  }

  async markFailed(id: string, error: unknown, maxAttempts = 5) {
    const rows = await this.store.query<any>(
      `SELECT "attempts" FROM "avos_core_flow_outbox_v2" WHERE "id"=$1`,
      id,
    );
    const attempts = Number(rows[0]?.attempts ?? 0) + 1;
    const status = attempts >= maxAttempts ? "dead-lettered" : "failed";
    await this.store.execute(
      `UPDATE "avos_core_flow_outbox_v2"
       SET "status"=$2,"attempts"=$3,"last_error"=$4,
           "next_attempt_at"=$5
       WHERE "id"=$1`,
      id,
      status,
      attempts,
      error instanceof Error ? error.message : String(error),
      new Date(Date.now() + Math.min(attempts * 60_000, 900_000)),
    );
    return { id, status, attempts };
  }

  async replayDeadLetter(id: string) {
    await this.store.execute(
      `UPDATE "avos_core_flow_outbox_v2"
       SET "status"='pending',"attempts"=0,"last_error"=NULL,
           "next_attempt_at"=CURRENT_TIMESTAMP
       WHERE "id"=$1 AND "status"='dead-lettered'`,
      id,
    );
    return { id, replayed: true };
  }

  async dashboard() {
    const rows = await this.store.query<any>(
      `SELECT "status", COUNT(*)::int AS "count"
       FROM "avos_core_flow_outbox_v2" GROUP BY "status"`,
    );
    return Object.fromEntries(rows.map((row) => [row.status, Number(row.count)]));
  }
}

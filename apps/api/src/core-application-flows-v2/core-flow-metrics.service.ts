import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { CoreFlowDurableStoreService } from "./core-flow-durable-store.service";

@Injectable()
export class CoreFlowMetricsService {
  constructor(private readonly store: CoreFlowDurableStoreService) {}

  async record(dto: any) {
    const id = randomUUID();
    await this.store.execute(
      `INSERT INTO "avos_core_flow_telemetry_signal"
       ("id","execution_id","flow","type","name","value","severity","attributes_json")
       VALUES ($1,$2,$3,'metric',$4,$5,$6,$7)`,
      id,
      dto?.executionId ?? null,
      String(dto?.flow ?? "unknown"),
      String(dto?.name ?? "metric"),
      Number(dto?.value ?? 0),
      dto?.severity ?? "info",
      JSON.stringify(dto?.attributes ?? {}),
    );
    return { id, ...dto, type: "metric", createdAt: new Date().toISOString() };
  }

  async aggregate(flow: string, name: string, windowMinutes = 60) {
    const rows = await this.store.query<any>(
      `SELECT
         COUNT(*)::int AS "count",
         AVG("value") AS "average",
         MIN("value") AS "minimum",
         MAX("value") AS "maximum"
       FROM "avos_core_flow_telemetry_signal"
       WHERE "flow"=$1 AND "name"=$2 AND "type"='metric'
       AND "created_at" >= CURRENT_TIMESTAMP - ($3 || ' minutes')::interval`,
      flow,
      name,
      Math.max(Number(windowMinutes), 1),
    );
    return { flow, name, windowMinutes, ...rows[0] };
  }

  async recent(limit = 100) {
    return this.store.query<any>(
      `SELECT * FROM "avos_core_flow_telemetry_signal"
       ORDER BY "created_at" DESC LIMIT $1`,
      Math.max(Number(limit), 1),
    );
  }
}

import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { CoreFlowDurableStoreService } from "./core-flow-durable-store.service";

@Injectable()
export class CoreFlowAlertingService {
  constructor(private readonly store: CoreFlowDurableStoreService) {}

  async emit(dto: any) {
    const id = randomUUID();
    await this.store.execute(
      `INSERT INTO "avos_core_flow_telemetry_signal"
       ("id","execution_id","flow","type","name","value","severity","attributes_json")
       VALUES ($1,$2,$3,'alert',$4,$5,$6,$7)`,
      id,
      dto?.executionId ?? null,
      String(dto?.flow ?? "unknown"),
      String(dto?.name ?? "runtime-alert"),
      dto?.value === undefined ? null : Number(dto.value),
      dto?.severity ?? "warning",
      JSON.stringify(dto?.attributes ?? {}),
    );

    return {
      id,
      type: "alert",
      flow: dto?.flow,
      name: dto?.name,
      severity: dto?.severity ?? "warning",
      createdAt: new Date().toISOString(),
    };
  }

  async active(limit = 100) {
    return this.store.query<any>(
      `SELECT * FROM "avos_core_flow_telemetry_signal"
       WHERE "type"='alert'
       ORDER BY "created_at" DESC LIMIT $1`,
      Math.max(Number(limit), 1),
    );
  }
}

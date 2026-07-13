import { Injectable, OnModuleInit } from "@nestjs/common";
import { CoreFlowDurableStoreService } from "./core-flow-durable-store.service";

@Injectable()
export class CoreFlowTelemetryStoreService implements OnModuleInit {
  constructor(private readonly store: CoreFlowDurableStoreService) {}

  async onModuleInit() {
    await this.store.execute(`
      CREATE TABLE IF NOT EXISTS "avos_core_flow_telemetry_signal" (
        "id" TEXT PRIMARY KEY,
        "execution_id" TEXT NULL,
        "flow" TEXT NOT NULL,
        "type" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "value" DOUBLE PRECISION NULL,
        "severity" TEXT NULL,
        "attributes_json" TEXT NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await this.store.execute(`
      CREATE TABLE IF NOT EXISTS "avos_core_flow_trace_span" (
        "id" TEXT PRIMARY KEY,
        "trace_id" TEXT NOT NULL,
        "parent_span_id" TEXT NULL,
        "execution_id" TEXT NULL,
        "flow" TEXT NOT NULL,
        "operation" TEXT NOT NULL,
        "started_at" TIMESTAMP NOT NULL,
        "ended_at" TIMESTAMP NULL,
        "duration_ms" DOUBLE PRECISION NULL,
        "status" TEXT NOT NULL
      )
    `);

    await this.store.execute(`
      CREATE TABLE IF NOT EXISTS "avos_core_flow_slo" (
        "id" TEXT PRIMARY KEY,
        "flow" TEXT NOT NULL,
        "metric" TEXT NOT NULL,
        "target" DOUBLE PRECISION NOT NULL,
        "window_minutes" INTEGER NOT NULL,
        "status" TEXT NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await this.store.execute(`
      CREATE INDEX IF NOT EXISTS "avos_core_flow_telemetry_signal_flow_idx"
      ON "avos_core_flow_telemetry_signal" ("flow","created_at")
    `);

    await this.store.execute(`
      CREATE INDEX IF NOT EXISTS "avos_core_flow_trace_span_trace_idx"
      ON "avos_core_flow_trace_span" ("trace_id")
    `);
  }
}

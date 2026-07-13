import { Injectable, OnModuleInit } from "@nestjs/common";
import { CoreFlowDurableStoreService } from "./core-flow-durable-store.service";

@Injectable()
export class CoreFlowWorkerStoreService implements OnModuleInit {
  constructor(private readonly store: CoreFlowDurableStoreService) {}

  async onModuleInit() {
    await this.store.execute(`
      CREATE TABLE IF NOT EXISTS "avos_core_flow_worker" (
        "id" TEXT PRIMARY KEY,
        "name" TEXT NOT NULL,
        "capabilities_json" TEXT NOT NULL,
        "status" TEXT NOT NULL,
        "heartbeat_at" TIMESTAMP NOT NULL,
        "lease_until" TIMESTAMP NOT NULL,
        "processed" INTEGER NOT NULL DEFAULT 0,
        "failed" INTEGER NOT NULL DEFAULT 0,
        "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await this.store.execute(`
      CREATE TABLE IF NOT EXISTS "avos_core_flow_outbox_v2" (
        "id" TEXT PRIMARY KEY,
        "topic" TEXT NOT NULL,
        "payload_json" TEXT NOT NULL,
        "status" TEXT NOT NULL,
        "attempts" INTEGER NOT NULL DEFAULT 0,
        "next_attempt_at" TIMESTAMP NULL,
        "last_error" TEXT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "published_at" TIMESTAMP NULL
      )
    `);

    await this.store.execute(`
      CREATE TABLE IF NOT EXISTS "avos_core_flow_inbox_v2" (
        "id" TEXT PRIMARY KEY,
        "source" TEXT NOT NULL,
        "message_key" TEXT NOT NULL,
        "payload_json" TEXT NOT NULL,
        "status" TEXT NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "processed_at" TIMESTAMP NULL
      )
    `);

    await this.store.execute(`
      CREATE UNIQUE INDEX IF NOT EXISTS "avos_core_flow_inbox_v2_key_uq"
      ON "avos_core_flow_inbox_v2" ("source","message_key")
    `);
  }
}

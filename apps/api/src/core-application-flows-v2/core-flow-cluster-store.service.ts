import { Injectable, OnModuleInit } from "@nestjs/common";
import { CoreFlowDurableStoreService } from "./core-flow-durable-store.service";

@Injectable()
export class CoreFlowClusterStoreService implements OnModuleInit {
  constructor(private readonly store: CoreFlowDurableStoreService) {}

  async onModuleInit() {
    await this.store.execute(`
      CREATE TABLE IF NOT EXISTS "avos_core_flow_cluster_node" (
        "id" TEXT PRIMARY KEY,
        "name" TEXT NOT NULL,
        "region" TEXT NOT NULL,
        "capacity" INTEGER NOT NULL,
        "load" INTEGER NOT NULL DEFAULT 0,
        "status" TEXT NOT NULL,
        "lease_until" TIMESTAMP NOT NULL,
        "heartbeat_at" TIMESTAMP NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await this.store.execute(`
      CREATE TABLE IF NOT EXISTS "avos_core_flow_cluster_lock" (
        "name" TEXT PRIMARY KEY,
        "owner_id" TEXT NOT NULL,
        "lease_until" TIMESTAMP NOT NULL,
        "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await this.store.execute(`
      CREATE TABLE IF NOT EXISTS "avos_core_flow_distributed_schedule" (
        "id" TEXT PRIMARY KEY,
        "execution_id" TEXT NOT NULL,
        "partition_key" TEXT NOT NULL,
        "target_node_id" TEXT NOT NULL,
        "execute_at" TIMESTAMP NOT NULL,
        "status" TEXT NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }
}

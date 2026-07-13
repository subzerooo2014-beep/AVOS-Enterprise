import { Injectable, NotFoundException } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { CoreFlowDurableStoreService } from "./core-flow-durable-store.service";

@Injectable()
export class CoreFlowWorkerRegistryService {
  constructor(private readonly store: CoreFlowDurableStoreService) {}

  async register(dto: any) {
    const id = randomUUID();
    const leaseUntil = new Date(Date.now() + Math.max(Number(dto?.leaseMs ?? 60_000), 1));
    await this.store.execute(
      `INSERT INTO "avos_core_flow_worker"
       ("id","name","capabilities_json","status","heartbeat_at","lease_until")
       VALUES ($1,$2,$3,'active',CURRENT_TIMESTAMP,$4)`,
      id,
      String(dto?.name ?? "worker"),
      JSON.stringify(Array.isArray(dto?.capabilities) ? dto.capabilities : []),
      leaseUntil,
    );
    return this.findOne(id);
  }

  async findAll() {
    return this.store.query<any>(
      `SELECT * FROM "avos_core_flow_worker" ORDER BY "created_at" DESC`,
    );
  }

  async findOne(id: string) {
    const rows = await this.store.query<any>(
      `SELECT * FROM "avos_core_flow_worker" WHERE "id"=$1`,
      id,
    );
    if (!rows[0]) throw new NotFoundException("Durable worker not found");
    return rows[0];
  }

  async heartbeat(id: string, leaseMs = 60_000) {
    await this.findOne(id);
    await this.store.execute(
      `UPDATE "avos_core_flow_worker"
       SET "heartbeat_at"=CURRENT_TIMESTAMP,
           "lease_until"=$2,
           "status"='active'
       WHERE "id"=$1`,
      id,
      new Date(Date.now() + Math.max(Number(leaseMs), 1)),
    );
    return this.findOne(id);
  }

  async markOfflineExpired() {
    const updated = await this.store.execute(
      `UPDATE "avos_core_flow_worker"
       SET "status"='offline'
       WHERE "lease_until" < CURRENT_TIMESTAMP
       AND "status" IN ('active','degraded')`,
    );
    return { markedOffline: updated, executedAt: new Date().toISOString() };
  }
}

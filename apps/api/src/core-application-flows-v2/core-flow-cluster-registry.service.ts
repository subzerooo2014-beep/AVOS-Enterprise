import { Injectable, NotFoundException } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { CoreFlowDurableStoreService } from "./core-flow-durable-store.service";

@Injectable()
export class CoreFlowClusterRegistryService {
  constructor(private readonly store: CoreFlowDurableStoreService) {}

  async register(dto: any) {
    const id = randomUUID();
    const leaseUntil = new Date(Date.now() + Math.max(Number(dto?.leaseMs ?? 60_000), 1));

    await this.store.execute(
      `INSERT INTO "avos_core_flow_cluster_node"
       ("id","name","region","capacity","load","status","lease_until","heartbeat_at")
       VALUES ($1,$2,$3,$4,$5,'active',$6,CURRENT_TIMESTAMP)`,
      id,
      String(dto?.name ?? "cluster-node"),
      String(dto?.region ?? "global"),
      Math.max(Number(dto?.capacity ?? 100), 1),
      Math.min(Math.max(Number(dto?.load ?? 0), 0), 100),
      leaseUntil,
    );

    return this.findOne(id);
  }

  async findAll() {
    return this.store.query<any>(
      `SELECT * FROM "avos_core_flow_cluster_node" ORDER BY "created_at" DESC`,
    );
  }

  async findOne(id: string) {
    const rows = await this.store.query<any>(
      `SELECT * FROM "avos_core_flow_cluster_node" WHERE "id"=$1`,
      id,
    );
    if (!rows[0]) throw new NotFoundException("Cluster node not found");
    return rows[0];
  }

  async heartbeat(id: string, dto: any = {}) {
    await this.findOne(id);
    const leaseUntil = new Date(Date.now() + Math.max(Number(dto?.leaseMs ?? 60_000), 1));
    const load = Math.min(Math.max(Number(dto?.load ?? 0), 0), 100);
    const status = load >= 90 ? "degraded" : "active";

    await this.store.execute(
      `UPDATE "avos_core_flow_cluster_node"
       SET "load"=$2,"status"=$3,"lease_until"=$4,"heartbeat_at"=CURRENT_TIMESTAMP
       WHERE "id"=$1`,
      id,
      load,
      status,
      leaseUntil,
    );
    return this.findOne(id);
  }

  async markOfflineExpired() {
    const count = await this.store.execute(
      `UPDATE "avos_core_flow_cluster_node"
       SET "status"='offline'
       WHERE "lease_until" < CURRENT_TIMESTAMP
       AND "status" IN ('active','leader','degraded')`,
    );
    return { markedOffline: count, executedAt: new Date().toISOString() };
  }
}

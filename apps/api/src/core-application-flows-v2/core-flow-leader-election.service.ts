import { Injectable } from "@nestjs/common";
import { CoreFlowDurableStoreService } from "./core-flow-durable-store.service";

@Injectable()
export class CoreFlowLeaderElectionService {
  constructor(private readonly store: CoreFlowDurableStoreService) {}

  async acquire(nodeId: string, leaseMs = 30_000) {
    const leaseUntil = new Date(Date.now() + Math.max(Number(leaseMs), 1));

    const updated = await this.store.execute(
      `INSERT INTO "avos_core_flow_cluster_lock" ("name","owner_id","lease_until")
       VALUES ('global-leader',$1,$2)
       ON CONFLICT ("name") DO UPDATE
       SET "owner_id"=EXCLUDED."owner_id",
           "lease_until"=EXCLUDED."lease_until",
           "updated_at"=CURRENT_TIMESTAMP
       WHERE "avos_core_flow_cluster_lock"."lease_until" < CURRENT_TIMESTAMP
          OR "avos_core_flow_cluster_lock"."owner_id" = EXCLUDED."owner_id"`,
      nodeId,
      leaseUntil,
    );

    return {
      acquired: updated > 0,
      nodeId,
      leaseUntil: leaseUntil.toISOString(),
    };
  }

  async current() {
    const rows = await this.store.query<any>(
      `SELECT * FROM "avos_core_flow_cluster_lock"
       WHERE "name"='global-leader'`,
    );
    const row = rows[0];
    if (!row) return null;

    return {
      ownerId: row.owner_id,
      leaseUntil: row.lease_until,
      active: new Date(row.lease_until).getTime() > Date.now(),
    };
  }
}

import { Injectable, ServiceUnavailableException } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { CoreFlowDurableStoreService } from "./core-flow-durable-store.service";
import { CoreFlowClusterRegistryService } from "./core-flow-cluster-registry.service";

@Injectable()
export class CoreFlowDistributedSchedulerService {
  constructor(
    private readonly store: CoreFlowDurableStoreService,
    private readonly registry: CoreFlowClusterRegistryService,
  ) {}

  async schedule(dto: any) {
    const nodes = (await this.registry.findAll())
      .filter((node: any) => ["active", "leader"].includes(node.status))
      .sort((a: any, b: any) => Number(a.load) - Number(b.load));

    const target = nodes[0];
    if (!target) {
      throw new ServiceUnavailableException("No active cluster node available.");
    }

    const id = randomUUID();
    await this.store.execute(
      `INSERT INTO "avos_core_flow_distributed_schedule"
       ("id","execution_id","partition_key","target_node_id","execute_at","status")
       VALUES ($1,$2,$3,$4,$5,'scheduled')`,
      id,
      String(dto?.executionId),
      String(dto?.partitionKey ?? "default"),
      target.id,
      new Date(dto?.executeAt ?? Date.now()),
    );

    return {
      id,
      executionId: String(dto?.executionId),
      partitionKey: String(dto?.partitionKey ?? "default"),
      targetNodeId: target.id,
      status: "scheduled",
    };
  }

  async dispatchDue() {
    const rows = await this.store.query<any>(
      `SELECT * FROM "avos_core_flow_distributed_schedule"
       WHERE "status"='scheduled'
       AND "execute_at" <= CURRENT_TIMESTAMP
       ORDER BY "execute_at" ASC`,
    );

    for (const row of rows) {
      await this.store.transaction(async (tx) => {
        await tx.$executeRawUnsafe(
          `UPDATE "avos_core_flow_distributed_schedule"
           SET "status"='dispatched' WHERE "id"=$1`,
          row.id,
        );
        await tx.$executeRawUnsafe(
          `UPDATE "avos_core_flow_execution"
           SET "status"='queued',"updated_at"=CURRENT_TIMESTAMP
           WHERE "id"=$1`,
          row.execution_id,
        );
      });
    }

    return { dispatched: rows.length, dispatchedAt: new Date().toISOString() };
  }
}

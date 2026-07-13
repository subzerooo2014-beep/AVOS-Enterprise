import { Injectable, NotFoundException } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { CoreFlowDurableStoreService } from "./core-flow-durable-store.service";
import { CoreFlowMetricsService } from "./core-flow-metrics.service";

@Injectable()
export class CoreFlowSloService {
  constructor(
    private readonly store: CoreFlowDurableStoreService,
    private readonly metrics: CoreFlowMetricsService,
  ) {}

  async create(dto: any) {
    const id = randomUUID();
    await this.store.execute(
      `INSERT INTO "avos_core_flow_slo"
       ("id","flow","metric","target","window_minutes","status")
       VALUES ($1,$2,$3,$4,$5,'healthy')`,
      id,
      String(dto?.flow ?? "unknown"),
      String(dto?.metric ?? "successRate"),
      Number(dto?.target ?? 99.9),
      Math.max(Number(dto?.windowMinutes ?? 60), 1),
    );
    return this.findOne(id);
  }

  async findOne(id: string) {
    const rows = await this.store.query<any>(
      `SELECT * FROM "avos_core_flow_slo" WHERE "id"=$1`,
      id,
    );
    if (!rows[0]) throw new NotFoundException("Flow SLO not found");
    return rows[0];
  }

  async list() {
    return this.store.query<any>(
      `SELECT * FROM "avos_core_flow_slo" ORDER BY "created_at" DESC`,
    );
  }

  async evaluate(id: string) {
    const slo = await this.findOne(id);
    const aggregate = await this.metrics.aggregate(
      slo.flow,
      slo.metric,
      Number(slo.window_minutes),
    );

    const actual = Number(aggregate.average ?? 0);
    const target = Number(slo.target);
    const status =
      actual >= target
        ? "healthy"
        : actual >= target * 0.95
          ? "warning"
          : "breached";

    await this.store.execute(
      `UPDATE "avos_core_flow_slo" SET "status"=$2 WHERE "id"=$1`,
      id,
      status,
    );

    return { sloId: id, actual, target, status, aggregate };
  }
}

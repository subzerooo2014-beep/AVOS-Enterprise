import { Injectable } from "@nestjs/common";
import type { FlowCostRecord } from "./core-flow-enterprise.types";

@Injectable()
export class CoreFlowCostService {
  private readonly records: FlowCostRecord[] = [];

  record(
    executionId: string,
    flow: string,
    units: number,
    unitCost: number,
    currency = "AED",
  ) {
    const normalizedUnits = Math.max(Number(units || 0), 0);
    const normalizedUnitCost = Math.max(Number(unitCost || 0), 0);

    const record: FlowCostRecord = {
      id: `cost_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      executionId,
      flow,
      units: normalizedUnits,
      unitCost: normalizedUnitCost,
      totalCost: Number((normalizedUnits * normalizedUnitCost).toFixed(4)),
      currency,
      recordedAt: new Date().toISOString(),
    };

    this.records.push(record);
    return record;
  }

  findAll(query: any = {}) {
    return this.records
      .filter((item) => !query.flow || item.flow === query.flow)
      .filter(
        (item) =>
          !query.executionId || item.executionId === query.executionId,
      )
      .slice()
      .reverse();
  }

  dashboard() {
    const totalCost = this.records.reduce(
      (sum, item) => sum + item.totalCost,
      0,
    );

    return {
      records: this.records.length,
      totalCost: Number(totalCost.toFixed(4)),
      byFlow: this.records.reduce<Record<string, number>>((acc, item) => {
        acc[item.flow] = Number(
          ((acc[item.flow] ?? 0) + item.totalCost).toFixed(4),
        );
        return acc;
      }, {}),
      generatedAt: new Date().toISOString(),
    };
  }
}

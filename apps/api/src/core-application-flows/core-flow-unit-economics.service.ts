import { Injectable } from "@nestjs/common";
import type { FlowUnitEconomics } from "./core-flow-economics.types";

@Injectable()
export class CoreFlowUnitEconomicsService {
  private readonly records: FlowUnitEconomics[] = [];

  calculate(flow: string, revenue: number, cost: number) {
    const normalizedRevenue = Number(revenue || 0);
    const normalizedCost = Number(cost || 0);
    const margin = normalizedRevenue - normalizedCost;
    const marginPercent = normalizedRevenue
      ? Number(((margin / normalizedRevenue) * 100).toFixed(2))
      : 0;

    const record: FlowUnitEconomics = {
      id: `economics_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      flow,
      revenue: normalizedRevenue,
      cost: normalizedCost,
      margin,
      marginPercent,
      calculatedAt: new Date().toISOString(),
    };

    this.records.push(record);
    return record;
  }

  findAll(flow?: string) {
    return this.records
      .filter((item) => !flow || item.flow === flow)
      .slice()
      .reverse();
  }

  dashboard() {
    return {
      total: this.records.length,
      profitable: this.records.filter((item) => item.margin > 0).length,
      lossMaking: this.records.filter((item) => item.margin < 0).length,
      averageMarginPercent: this.records.length
        ? Number(
            (
              this.records.reduce((sum, item) => sum + item.marginPercent, 0) /
              this.records.length
            ).toFixed(2),
          )
        : 0,
      generatedAt: new Date().toISOString(),
    };
  }
}

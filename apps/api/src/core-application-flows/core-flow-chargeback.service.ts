import { Injectable } from "@nestjs/common";
import type { FlowChargebackRecord } from "./core-flow-economics.types";

@Injectable()
export class CoreFlowChargebackService {
  private readonly records: FlowChargebackRecord[] = [];

  record(dto: any) {
    const record: FlowChargebackRecord = {
      id: `chargeback_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      executionId: String(dto?.executionId ?? "unknown"),
      flow: String(dto?.flow ?? "unknown"),
      tenantId: String(dto?.tenantId ?? "default"),
      organizationId: dto?.organizationId
        ? String(dto.organizationId)
        : undefined,
      amount: Math.max(Number(dto?.amount ?? 0), 0),
      currency: String(dto?.currency ?? "AED"),
      category: String(dto?.category ?? "execution"),
      recordedAt: new Date().toISOString(),
    };

    this.records.push(record);
    return record;
  }

  findAll(query: any = {}) {
    return this.records
      .filter((item) => !query.flow || item.flow === query.flow)
      .filter((item) => !query.tenantId || item.tenantId === query.tenantId)
      .filter(
        (item) =>
          !query.organizationId ||
          item.organizationId === query.organizationId,
      )
      .slice()
      .reverse();
  }

  dashboard() {
    const total = this.records.reduce((sum, item) => sum + item.amount, 0);
    return {
      totalRecords: this.records.length,
      totalAmount: Number(total.toFixed(4)),
      byTenant: this.records.reduce<Record<string, number>>((acc, item) => {
        acc[item.tenantId] = Number(
          ((acc[item.tenantId] ?? 0) + item.amount).toFixed(4),
        );
        return acc;
      }, {}),
      generatedAt: new Date().toISOString(),
    };
  }
}

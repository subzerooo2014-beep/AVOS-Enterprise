import { Injectable } from "@nestjs/common";
import type { FlowCompatibilityRecord } from "./core-flow-standards.types";

@Injectable()
export class CoreFlowCompatibilityService {
  private readonly records: FlowCompatibilityRecord[] = [];

  check(dto: any) {
    const producerFields = Array.isArray(dto?.producerFields)
      ? dto.producerFields.map(String)
      : [];
    const consumerRequiredFields = Array.isArray(dto?.consumerRequiredFields)
      ? dto.consumerRequiredFields.map(String)
      : [];

    const issues = consumerRequiredFields
      .filter((field: string) => !producerFields.includes(field))
      .map((field: string) => `missing-field:${field}`);

    const record: FlowCompatibilityRecord = {
      id: `compatibility_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      producer: String(dto?.producer ?? "unknown-producer"),
      consumer: String(dto?.consumer ?? "unknown-consumer"),
      contract: String(dto?.contract ?? "default-contract"),
      compatible: issues.length === 0,
      issues,
      checkedAt: new Date().toISOString(),
    };

    this.records.push(record);
    return record;
  }

  findAll(query: any = {}) {
    return this.records
      .filter(
        (item) => !query.producer || item.producer === query.producer,
      )
      .filter(
        (item) => !query.consumer || item.consumer === query.consumer,
      )
      .filter(
        (item) => !query.contract || item.contract === query.contract,
      )
      .slice()
      .reverse();
  }

  dashboard() {
    return {
      total: this.records.length,
      compatible: this.records.filter((item) => item.compatible).length,
      incompatible: this.records.filter((item) => !item.compatible).length,
      generatedAt: new Date().toISOString(),
    };
  }
}

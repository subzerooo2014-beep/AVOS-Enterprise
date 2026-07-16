import { Injectable } from "@nestjs/common";
import { NervousSystemTraceRecord } from "../foundation-pack-6.types";

@Injectable()
export class NervousSystemTraceService {
  private readonly records: NervousSystemTraceRecord[] = [];

  record(
    input: Omit<NervousSystemTraceRecord, "id" | "occurredAt">
  ) {
    const record: NervousSystemTraceRecord = {
      ...input,
      id: `nervous-trace:${Date.now()}:${this.records.length + 1}`,
      occurredAt: new Date().toISOString()
    };

    this.records.push(record);
    return record;
  }

  list() {
    return [...this.records];
  }

  byCorrelation(correlationId: string) {
    return this.records
      .filter((record) => record.correlationId === correlationId)
      .sort((left, right) => left.occurredAt.localeCompare(right.occurredAt));
  }

  summary() {
    return {
      total: this.records.length,
      failures: this.records.filter(
        (record) => record.outcome === "failure"
      ).length,
      blocked: this.records.filter(
        (record) => record.outcome === "blocked"
      ).length,
      pending: this.records.filter(
        (record) => record.outcome === "pending"
      ).length
    };
  }
}

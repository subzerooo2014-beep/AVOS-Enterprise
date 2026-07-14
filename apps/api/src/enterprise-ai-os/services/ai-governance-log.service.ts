import { Injectable } from "@nestjs/common";
@Injectable()
export class AiGovernanceLogService {
  private readonly records: Array<Record<string, unknown>> = [];
  record(input: Record<string, unknown>) {
    const record = { id: `gov_log_${Date.now()}`, ...input, createdAt: new Date().toISOString() };
    this.records.push(record);
    return record;
  }
  list() { return [...this.records]; }
}

import { Injectable } from "@nestjs/common";
@Injectable()
export class AiAlertService {
  private readonly records: Array<Record<string, unknown>> = [];
  create(input: Record<string, unknown>) {
    const record = { id: `ai_alert_${Date.now()}`, ...input, status: "OPEN", createdAt: new Date().toISOString() };
    this.records.push(record);
    return record;
  }
  list() { return [...this.records]; }
}

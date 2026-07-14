import { Injectable } from "@nestjs/common";
@Injectable()
export class DealershipLeadService {
  private readonly records: Array<Record<string, unknown>> = [];
  create(input: Record<string, unknown>) {
    const record = { id: `dealership_lead_${Date.now()}`, ...input, status: "NEW" };
    this.records.push(record);
    return record;
  }
  list() { return [...this.records]; }
}

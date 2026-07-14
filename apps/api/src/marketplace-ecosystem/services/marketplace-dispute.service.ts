import { Injectable } from "@nestjs/common";
@Injectable()
export class MarketplaceDisputeService {
  private readonly records: Array<Record<string, unknown>> = [];
  create(input: Record<string, unknown>) {
    const record = { id: `dispute_${Date.now()}`, ...input, status: "OPEN" };
    this.records.push(record);
    return record;
  }
  list() { return [...this.records]; }
}

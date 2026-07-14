import { Injectable } from "@nestjs/common";
@Injectable()
export class TyreManagementService {
  private readonly records: Array<Record<string, unknown>> = [];
  record(input: Record<string, unknown>) {
    const item = { id: `tyre_${Date.now()}`, ...input, status: "INSTALLED" };
    this.records.push(item);
    return item;
  }
  list() { return [...this.records]; }
}

import { Injectable } from "@nestjs/common";
@Injectable()
export class PartsManagementService {
  private readonly records: Array<Record<string, unknown>> = [];
  record(input: Record<string, unknown>) {
    const item = { id: `part_${Date.now()}`, ...input };
    this.records.push(item);
    return item;
  }
  list() { return [...this.records]; }
}

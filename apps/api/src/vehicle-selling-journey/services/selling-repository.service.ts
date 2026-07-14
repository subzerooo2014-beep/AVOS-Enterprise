import { Injectable, NotFoundException } from "@nestjs/common";
import { SellingJourneyRecord } from "../vehicle-selling-journey.types";
@Injectable()
export class SellingRepositoryService {
  private readonly records = new Map<string, SellingJourneyRecord>();
  save(record: SellingJourneyRecord) { this.records.set(record.id, record); return record; }
  get(id: string) {
    const record = this.records.get(id);
    if (!record) throw new NotFoundException(`Selling journey ${id} not found`);
    return record;
  }
  list() { return [...this.records.values()]; }
}

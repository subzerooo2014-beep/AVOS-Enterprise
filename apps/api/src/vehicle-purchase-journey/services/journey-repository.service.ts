import { Injectable, NotFoundException } from "@nestjs/common";
import { PurchaseJourneyRecord } from "../vehicle-purchase-journey.types";

@Injectable()
export class JourneyRepositoryService {
  private readonly journeys = new Map<string, PurchaseJourneyRecord>();

  save(record: PurchaseJourneyRecord) { this.journeys.set(record.id, record); return record; }
  get(id: string) {
    const record = this.journeys.get(id);
    if (!record) throw new NotFoundException(`Journey ${id} not found`);
    return record;
  }
  list() { return [...this.journeys.values()]; }
}

import { Injectable, NotFoundException } from "@nestjs/common";
import { MarketplaceListingRecord } from "../marketplace-ecosystem.types";
@Injectable()
export class ListingRepositoryService {
  private readonly records = new Map<string, MarketplaceListingRecord>();
  save(record: MarketplaceListingRecord) { this.records.set(record.id, record); return record; }
  get(id: string) {
    const record = this.records.get(id);
    if (!record) throw new NotFoundException(`Listing ${id} not found`);
    return record;
  }
  list() { return [...this.records.values()]; }
}

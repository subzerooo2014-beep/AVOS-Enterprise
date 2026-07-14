import { Injectable, NotFoundException } from "@nestjs/common";
import { MarketplaceEntityRecord } from "../marketplace-ecosystem.types";
@Injectable()
export class EntityRepositoryService {
  private readonly records = new Map<string, MarketplaceEntityRecord>();
  save(record: MarketplaceEntityRecord) { this.records.set(record.id, record); return record; }
  get(id: string) {
    const record = this.records.get(id);
    if (!record) throw new NotFoundException(`Marketplace entity ${id} not found`);
    return record;
  }
  list() { return [...this.records.values()]; }
}

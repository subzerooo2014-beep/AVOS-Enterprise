import { Injectable, NotFoundException } from "@nestjs/common";
import { AuctionRecord } from "../auction-runtime.types";
@Injectable()
export class AuctionRepositoryService {
  private readonly auctions = new Map<string, AuctionRecord>();
  save(record: AuctionRecord) { this.auctions.set(record.id, record); return record; }
  get(id: string) {
    const record = this.auctions.get(id);
    if (!record) throw new NotFoundException(`Auction ${id} not found`);
    return record;
  }
  list() { return [...this.auctions.values()]; }
}

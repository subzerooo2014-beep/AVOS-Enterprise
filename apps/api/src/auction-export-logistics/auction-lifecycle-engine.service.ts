import { Injectable } from '@nestjs/common';
import {
  Auction,
  AuctionStatus,
} from './auction-export-logistics.types';

@Injectable()
export class AuctionLifecycleEngineService {
  private readonly auctions = new Map<string, Auction>();

  create(auction: Auction) {
    this.auctions.set(auction.id, { ...auction });
    return { ...auction };
  }

  transition(id: string, status: AuctionStatus) {
    const current = this.auctions.get(id);
    if (!current) {
      throw new Error(`Auction not found: ${id}`);
    }

    const updated = { ...current, status };
    this.auctions.set(id, updated);
    return { ...updated };
  }

  get(id: string) {
    const auction = this.auctions.get(id);
    return auction ? { ...auction } : null;
  }

  list() {
    return [...this.auctions.values()].map((auction) => ({
      ...auction,
    }));
  }
}
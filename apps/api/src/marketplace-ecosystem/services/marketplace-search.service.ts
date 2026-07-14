import { Injectable } from "@nestjs/common";
import { ListingRepositoryService } from "./listing-repository.service";
@Injectable()
export class MarketplaceSearchService {
  constructor(private readonly listings: ListingRepositoryService) {}
  search(input: { query?: string; category?: string; minPrice?: number; maxPrice?: number }) {
    return this.listings.list().filter((item) => {
      if (input.query && !(`${item.title} ${item.description}`.toLowerCase().includes(input.query.toLowerCase()))) return false;
      if (input.category && item.category !== input.category) return false;
      if (input.minPrice !== undefined && item.price < input.minPrice) return false;
      if (input.maxPrice !== undefined && item.price > input.maxPrice) return false;
      return true;
    });
  }
}

import { Injectable } from "@nestjs/common";
import { KnowledgeMarketplaceListing } from "./knowledge-marketplace.types";

@Injectable()
export class KnowledgeMarketplacePricingService {
  calculate(listing: KnowledgeMarketplaceListing, quantity = 1): number {
    if (listing.pricingModel === "FREE") return 0;
    return Number((listing.price * Math.max(1, quantity)).toFixed(2));
  }
}
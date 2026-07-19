import { Injectable } from "@nestjs/common";
import { GlobalProductionOsStore } from "./global-production-os.store";
import { MarketplaceOffer } from "./global-production-os.types";

@Injectable()
export class GlobalProductionMarketplaceService {
  constructor(private readonly store: GlobalProductionOsStore) {}

  publish(
    factoryId: string,
    capability: string,
    availableCapacity: number,
    unitCost: number
  ): MarketplaceOffer {
    const factory = this.store.factories.get(factoryId);
    if (!factory) throw new Error(`Factory not found: ${factoryId}`);

    const offer: MarketplaceOffer = {
      id: this.store.nextId("production-offer"),
      factoryId,
      capability,
      availableCapacity,
      unitCost,
      trustScore: factory.trustScore,
      active: true,
      createdAt: this.store.now()
    };
    this.store.marketplaceOffers.set(offer.id, offer);
    return offer;
  }

  list(): MarketplaceOffer[] {
    return [...this.store.marketplaceOffers.values()];
  }
}
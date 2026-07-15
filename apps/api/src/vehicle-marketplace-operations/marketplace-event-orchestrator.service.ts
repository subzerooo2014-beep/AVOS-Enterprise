import { Injectable } from '@nestjs/common';
import {
  InventoryRecord,
  ListingMedia,
  MarketplaceMetric,
  PricingSignal,
  SearchDocument,
  VehicleListing,
} from './vehicle-marketplace-operations.types';
import { MarketplaceMediaManagerService } from './marketplace-media-manager.service';
import { VehicleInventoryEngineService } from './vehicle-inventory-engine.service';
import { SmartPricingCoordinatorService } from './smart-pricing-coordinator.service';
import { MarketplaceSearchIndexService } from './marketplace-search-index.service';
import { MarketplaceAnalyticsEngineService } from './marketplace-analytics-engine.service';
import { ListingFraudProtectionService } from './listing-fraud-protection.service';

@Injectable()
export class MarketplaceEventOrchestratorService {
  constructor(
    private readonly media: MarketplaceMediaManagerService,
    private readonly inventory: VehicleInventoryEngineService,
    private readonly pricing: SmartPricingCoordinatorService,
    private readonly search: MarketplaceSearchIndexService,
    private readonly analytics: MarketplaceAnalyticsEngineService,
    private readonly fraud: ListingFraudProtectionService,
  ) {}

  run(input: {
    listing: VehicleListing;
    media: ListingMedia[];
    inventory: InventoryRecord[];
    pricing: PricingSignal[];
    searchDocument: SearchDocument;
    metrics: MarketplaceMetric[];
  }) {
    const media = this.media.organize(input.media);
    const inventory = this.inventory.evaluate(input.inventory);
    const pricing = this.pricing.analyze(input.pricing);
    const fraud = this.fraud.evaluate(input.listing, input.media);
    const indexed = fraud.blocked
      ? null
      : this.search.index(input.searchDocument);
    const analytics = this.analytics.analyze(input.metrics);

    return {
      media,
      inventory,
      pricing,
      fraud,
      indexed,
      analytics,
    };
  }
}
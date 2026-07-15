import { Module } from '@nestjs/common';
import { VehicleMarketplaceOperationsController } from './vehicle-marketplace-operations.controller';
import { ListingLifecycleEngineService } from './listing-lifecycle-engine.service';
import { MarketplaceMediaManagerService } from './marketplace-media-manager.service';
import { VehicleInventoryEngineService } from './vehicle-inventory-engine.service';
import { SmartPricingCoordinatorService } from './smart-pricing-coordinator.service';
import { MarketplaceSearchIndexService } from './marketplace-search-index.service';
import { VehicleRecommendationEngineService } from './vehicle-recommendation-engine.service';
import { DealerOperationsEngineService } from './dealer-operations-engine.service';
import { MarketplaceAnalyticsEngineService } from './marketplace-analytics-engine.service';
import { ListingFraudProtectionService } from './listing-fraud-protection.service';
import { ReservationNegotiationEngineService } from './reservation-negotiation-engine.service';
import { MarketplaceEventOrchestratorService } from './marketplace-event-orchestrator.service';
import { MarketplaceOperationsDashboardService } from './marketplace-operations-dashboard.service';

@Module({
  controllers: [VehicleMarketplaceOperationsController],
  providers: [
    ListingLifecycleEngineService,
    MarketplaceMediaManagerService,
    VehicleInventoryEngineService,
    SmartPricingCoordinatorService,
    MarketplaceSearchIndexService,
    VehicleRecommendationEngineService,
    DealerOperationsEngineService,
    MarketplaceAnalyticsEngineService,
    ListingFraudProtectionService,
    ReservationNegotiationEngineService,
    MarketplaceEventOrchestratorService,
    MarketplaceOperationsDashboardService,
  ],
  exports: [
    ListingLifecycleEngineService,
    MarketplaceMediaManagerService,
    VehicleInventoryEngineService,
    SmartPricingCoordinatorService,
    MarketplaceSearchIndexService,
    VehicleRecommendationEngineService,
    DealerOperationsEngineService,
    MarketplaceAnalyticsEngineService,
    ListingFraudProtectionService,
    ReservationNegotiationEngineService,
    MarketplaceEventOrchestratorService,
    MarketplaceOperationsDashboardService,
  ],
})
export class VehicleMarketplaceOperationsModule {}
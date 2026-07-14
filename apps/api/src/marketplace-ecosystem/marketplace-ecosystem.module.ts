import { Module } from "@nestjs/common";
import { MarketplaceEcosystemController } from "./marketplace-ecosystem.controller";
import { MarketplaceEcosystemService } from "./marketplace-ecosystem.service";

import { EntityPolicy } from "./policies/entity.policy";
import { ListingPolicy } from "./policies/listing.policy";
import { MembershipPolicy } from "./policies/membership.policy";
import { CommissionPolicy } from "./policies/commission.policy";
import { ReviewPolicy } from "./policies/review.policy";
import { BookingPolicy } from "./policies/booking.policy";
import { OrderPolicy } from "./policies/order.policy";
import { TrustPolicy } from "./policies/trust.policy";

import { EntityRepositoryService } from "./services/entity-repository.service";
import { ListingRepositoryService } from "./services/listing-repository.service";
import { EntityService } from "./services/entity.service";
import { ListingService } from "./services/listing.service";
import { MembershipService } from "./services/membership.service";
import { CommissionService } from "./services/commission.service";
import { ReviewService } from "./services/review.service";
import { ServiceBookingService } from "./services/service-booking.service";
import { MarketplaceOrderService } from "./services/order.service";
import { WorkshopJobService } from "./services/workshop-job.service";
import { DealershipLeadService } from "./services/dealership-lead.service";
import { MarketplaceSearchService } from "./services/marketplace-search.service";
import { MarketplaceAuditService } from "./services/marketplace-audit.service";
import { MarketplaceAlertService } from "./services/marketplace-alert.service";
import { MarketplaceReportingService } from "./services/marketplace-reporting.service";
import { MarketplaceNotificationService } from "./services/marketplace-notification.service";
import { MarketplaceDashboardService } from "./services/marketplace-dashboard.service";
import { MarketplaceTrustService } from "./services/marketplace-trust.service";
import { MarketplaceSettlementService } from "./services/marketplace-settlement.service";
import { MarketplaceDisputeService } from "./services/marketplace-dispute.service";
import { MarketplaceCatalogService } from "./services/marketplace-catalog.service";
import { MarketplaceAnalyticsService } from "./services/marketplace-analytics.service";

import { MarketplaceRankingEngine } from "./ai/marketplace-ranking.engine";
import { ProviderMatchingEngine } from "./ai/provider-matching.engine";
import { PricingIntelligenceEngine } from "./ai/pricing-intelligence.engine";
import { MarketplaceFraudDetectionEngine } from "./ai/fraud-detection.engine";
import { MarketplaceDemandForecastEngine } from "./ai/demand-forecast.engine";
import { CommissionOptimizationEngine } from "./ai/commission-optimization.engine";
import { ReviewIntelligenceEngine } from "./ai/review-intelligence.engine";
import { InventoryOptimizationEngine } from "./ai/inventory-optimization.engine";

@Module({
  controllers: [MarketplaceEcosystemController],
  providers: [
    MarketplaceEcosystemService,

    EntityPolicy,
    ListingPolicy,
    MembershipPolicy,
    CommissionPolicy,
    ReviewPolicy,
    BookingPolicy,
    OrderPolicy,
    TrustPolicy,

    EntityRepositoryService,
    ListingRepositoryService,
    EntityService,
    ListingService,
    MembershipService,
    CommissionService,
    ReviewService,
    ServiceBookingService,
    MarketplaceOrderService,
    WorkshopJobService,
    DealershipLeadService,
    MarketplaceSearchService,
    MarketplaceAuditService,
    MarketplaceAlertService,
    MarketplaceReportingService,
    MarketplaceNotificationService,
    MarketplaceDashboardService,
    MarketplaceTrustService,
    MarketplaceSettlementService,
    MarketplaceDisputeService,
    MarketplaceCatalogService,
    MarketplaceAnalyticsService,

    MarketplaceRankingEngine,
    ProviderMatchingEngine,
    PricingIntelligenceEngine,
    MarketplaceFraudDetectionEngine,
    MarketplaceDemandForecastEngine,
    CommissionOptimizationEngine,
    ReviewIntelligenceEngine,
    InventoryOptimizationEngine,
  ],
  exports: [MarketplaceEcosystemService],
})
export class MarketplaceEcosystemModule {}

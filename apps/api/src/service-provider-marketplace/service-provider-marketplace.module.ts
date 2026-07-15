import { Module } from '@nestjs/common';
import { ServiceProviderMarketplaceController } from './service-provider-marketplace.controller';
import { ServiceCatalogEngineService } from './service-catalog-engine.service';
import { WorkshopProviderProfileEngineService } from './workshop-provider-profile-engine.service';
import { ServiceBookingEngineService } from './service-booking-engine.service';
import { CapacitySchedulingEngineService } from './capacity-scheduling-engine.service';
import { ServicePricingQuotationEngineService } from './service-pricing-quotation-engine.service';
import { PartsLaborCoordinationEngineService } from './parts-labor-coordination-engine.service';
import { ProviderPerformanceEngineService } from './provider-performance-engine.service';
import { ServiceQualitySlaEngineService } from './service-quality-sla-engine.service';
import { CustomerServiceJourneyEngineService } from './customer-service-journey-engine.service';
import { ServicePaymentCoordinatorService } from './service-payment-coordinator.service';
import { ComplaintsClaimsEngineService } from './complaints-claims-engine.service';
import { ServiceFulfillmentOrchestratorService } from './service-fulfillment-orchestrator.service';
import { ServiceMarketplaceDashboardService } from './service-marketplace-dashboard.service';

@Module({
  controllers: [ServiceProviderMarketplaceController],
  providers: [
    ServiceCatalogEngineService,
    WorkshopProviderProfileEngineService,
    ServiceBookingEngineService,
    CapacitySchedulingEngineService,
    ServicePricingQuotationEngineService,
    PartsLaborCoordinationEngineService,
    ProviderPerformanceEngineService,
    ServiceQualitySlaEngineService,
    CustomerServiceJourneyEngineService,
    ServicePaymentCoordinatorService,
    ComplaintsClaimsEngineService,
    ServiceFulfillmentOrchestratorService,
    ServiceMarketplaceDashboardService,
  ],
  exports: [
    ServiceCatalogEngineService,
    WorkshopProviderProfileEngineService,
    ServiceBookingEngineService,
    CapacitySchedulingEngineService,
    ServicePricingQuotationEngineService,
    PartsLaborCoordinationEngineService,
    ProviderPerformanceEngineService,
    ServiceQualitySlaEngineService,
    CustomerServiceJourneyEngineService,
    ServicePaymentCoordinatorService,
    ComplaintsClaimsEngineService,
    ServiceFulfillmentOrchestratorService,
    ServiceMarketplaceDashboardService,
  ],
})
export class ServiceProviderMarketplaceModule {}
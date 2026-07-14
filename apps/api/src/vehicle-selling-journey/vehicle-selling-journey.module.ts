import { Module } from "@nestjs/common";
import { VehicleSellingJourneyController } from "./vehicle-selling-journey.controller";
import { VehicleSellingJourneyService } from "./vehicle-selling-journey.service";
import { MediaPolicy } from "./policies/media.policy";
import { ListingPolicy } from "./policies/listing.policy";
import { OfferPolicy } from "./policies/offer.policy";
import { PublicationPolicy } from "./policies/publication.policy";
import { SaleCompletionPolicy } from "./policies/sale-completion.policy";
import { SellingRepositoryService } from "./services/selling-repository.service";
import { SellingTimelineService } from "./services/selling-timeline.service";
import { MediaUploadService } from "./services/media-upload.service";
import { MediaAnalysisService } from "./services/media-analysis.service";
import { SellerPricingService } from "./services/seller-pricing.service";
import { ListingOptimizationService } from "./services/listing-optimization.service";
import { PublicationService } from "./services/publication.service";
import { LeadManagementService } from "./services/lead-management.service";
import { LeadQualificationService } from "./services/lead-qualification.service";
import { SellerOfferService } from "./services/seller-offer.service";
import { SellerNegotiationService } from "./services/seller-negotiation.service";
import { SellerReservationService } from "./services/seller-reservation.service";
import { SaleCompletionService } from "./services/sale-completion.service";
import { HandoverService } from "./services/handover.service";
import { SellerNotificationService } from "./services/seller-notification.service";
import { SellerAuditService } from "./services/seller-audit.service";
import { SellerFeedbackService } from "./services/seller-feedback.service";
import { SellerDashboardService } from "./services/seller-dashboard.service";
import { SocialDistributionService } from "./services/social-distribution.service";
import { ListingPerformanceService } from "./services/listing-performance.service";

@Module({
  controllers: [VehicleSellingJourneyController],
  providers: [
    VehicleSellingJourneyService,
    MediaPolicy,
    ListingPolicy,
    OfferPolicy,
    PublicationPolicy,
    SaleCompletionPolicy,
    SellingRepositoryService,
    SellingTimelineService,
    MediaUploadService,
    MediaAnalysisService,
    SellerPricingService,
    ListingOptimizationService,
    PublicationService,
    LeadManagementService,
    LeadQualificationService,
    SellerOfferService,
    SellerNegotiationService,
    SellerReservationService,
    SaleCompletionService,
    HandoverService,
    SellerNotificationService,
    SellerAuditService,
    SellerFeedbackService,
    SellerDashboardService,
    SocialDistributionService,
    ListingPerformanceService,
  ],
  exports: [VehicleSellingJourneyService],
})
export class VehicleSellingJourneyModule {}

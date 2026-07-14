import { Module } from "@nestjs/common";
import { AuctionRuntimeController } from "./auction-runtime.controller";
import { AuctionRuntimeService } from "./auction-runtime.service";
import { AuctionCreationPolicy } from "./policies/auction-creation.policy";
import { ParticipantPolicy } from "./policies/participant.policy";
import { BidPolicy } from "./policies/bid.policy";
import { AutoBidPolicy } from "./policies/auto-bid.policy";
import { SettlementPolicy } from "./policies/settlement.policy";
import { AntiManipulationPolicy } from "./policies/anti-manipulation.policy";
import { AuctionRepositoryService } from "./services/auction-repository.service";
import { AuctionTimelineService } from "./services/auction-timeline.service";
import { ParticipantService } from "./services/participant.service";
import { BidService } from "./services/bid.service";
import { AutoBidService } from "./services/auto-bid.service";
import { AuctionSchedulerService } from "./services/auction-scheduler.service";
import { AuctionExtensionService } from "./services/auction-extension.service";
import { AuctionModerationService } from "./services/auction-moderation.service";
import { AuctionNotificationService } from "./services/auction-notification.service";
import { AuctionAuditService } from "./services/auction-audit.service";
import { AuctionFraudService } from "./services/auction-fraud.service";
import { AuctionSettlementService } from "./services/auction-settlement.service";
import { DepositService } from "./services/deposit.service";
import { AuctionPaymentService } from "./services/auction-payment.service";
import { AuctionDeliveryService } from "./services/auction-delivery.service";
import { AuctionFeedbackService } from "./services/auction-feedback.service";
import { AuctionReportingService } from "./services/auction-reporting.service";
import { AuctionDashboardService } from "./services/auction-dashboard.service";
import { AuctionAnalyticsService } from "./services/auction-analytics.service";
import { AuctionSearchService } from "./services/auction-search.service";
import { AuctionWinnerService } from "./services/auction-winner.service";

@Module({
  controllers: [AuctionRuntimeController],
  providers: [
    AuctionRuntimeService,
    AuctionCreationPolicy,
    ParticipantPolicy,
    BidPolicy,
    AutoBidPolicy,
    SettlementPolicy,
    AntiManipulationPolicy,
    AuctionRepositoryService,
    AuctionTimelineService,
    ParticipantService,
    BidService,
    AutoBidService,
    AuctionSchedulerService,
    AuctionExtensionService,
    AuctionModerationService,
    AuctionNotificationService,
    AuctionAuditService,
    AuctionFraudService,
    AuctionSettlementService,
    DepositService,
    AuctionPaymentService,
    AuctionDeliveryService,
    AuctionFeedbackService,
    AuctionReportingService,
    AuctionDashboardService,
    AuctionAnalyticsService,
    AuctionSearchService,
    AuctionWinnerService,
  ],
  exports: [AuctionRuntimeService],
})
export class AuctionRuntimeModule {}

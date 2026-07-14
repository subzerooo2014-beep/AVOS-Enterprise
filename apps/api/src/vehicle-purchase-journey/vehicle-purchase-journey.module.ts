import { Module } from "@nestjs/common";
import { VehiclePurchaseJourneyController } from "./vehicle-purchase-journey.controller";
import { VehiclePurchaseJourneyService } from "./vehicle-purchase-journey.service";
import { JourneyRepositoryService } from "./services/journey-repository.service";
import { JourneyTimelineService } from "./services/journey-timeline.service";
import { DiscoveryService } from "./services/discovery.service";
import { JourneyReservationService } from "./services/reservation.service";
import { JourneyNegotiationService } from "./services/negotiation.service";
import { JourneyInspectionService } from "./services/inspection.service";
import { JourneyFinanceService } from "./services/finance.service";
import { JourneyInsuranceService } from "./services/insurance.service";
import { JourneyPaymentService } from "./services/payment.service";
import { JourneyContractService } from "./services/contract.service";
import { OwnershipTransferService } from "./services/ownership-transfer.service";
import { JourneyDeliveryService } from "./services/delivery.service";
import { JourneyNotificationService } from "./services/notification.service";
import { JourneyAuditService } from "./services/audit.service";
import { JourneyFeedbackService } from "./services/feedback.service";
import { JourneyDashboardService } from "./services/journey-dashboard.service";
import { ReservationPolicy } from "./policies/reservation.policy";
import { NegotiationPolicy } from "./policies/negotiation.policy";
import { InspectionPolicy } from "./policies/inspection.policy";
import { PaymentPolicy } from "./policies/payment.policy";
import { CompletionPolicy } from "./policies/completion.policy";

@Module({
  controllers: [VehiclePurchaseJourneyController],
  providers: [
    VehiclePurchaseJourneyService,
    JourneyRepositoryService,
    JourneyTimelineService,
    DiscoveryService,
    JourneyReservationService,
    JourneyNegotiationService,
    JourneyInspectionService,
    JourneyFinanceService,
    JourneyInsuranceService,
    JourneyPaymentService,
    JourneyContractService,
    OwnershipTransferService,
    JourneyDeliveryService,
    JourneyNotificationService,
    JourneyAuditService,
    JourneyFeedbackService,
    JourneyDashboardService,
    ReservationPolicy,
    NegotiationPolicy,
    InspectionPolicy,
    PaymentPolicy,
    CompletionPolicy,
  ],
  exports: [VehiclePurchaseJourneyService],
})
export class VehiclePurchaseJourneyModule {}

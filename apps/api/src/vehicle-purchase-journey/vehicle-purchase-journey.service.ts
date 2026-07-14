import { Injectable } from "@nestjs/common";
import { makeJourneyId } from "./vehicle-purchase-journey.utils";
import { JourneyRepositoryService } from "./services/journey-repository.service";
import { JourneyTimelineService } from "./services/journey-timeline.service";
import { JourneyReservationService } from "./services/reservation.service";
import { JourneyNegotiationService } from "./services/negotiation.service";
import { JourneyInspectionService } from "./services/inspection.service";
import { JourneyFinanceService } from "./services/finance.service";
import { JourneyInsuranceService } from "./services/insurance.service";
import { JourneyPaymentService } from "./services/payment.service";
import { JourneyContractService } from "./services/contract.service";
import { OwnershipTransferService } from "./services/ownership-transfer.service";
import { JourneyDeliveryService } from "./services/delivery.service";
import { JourneyAuditService } from "./services/audit.service";
import { CompletionPolicy } from "./policies/completion.policy";

@Injectable()
export class VehiclePurchaseJourneyService {
  constructor(
    private readonly repo: JourneyRepositoryService,
    private readonly timeline: JourneyTimelineService,
    private readonly reservation: JourneyReservationService,
    private readonly negotiation: JourneyNegotiationService,
    private readonly inspection: JourneyInspectionService,
    private readonly finance: JourneyFinanceService,
    private readonly insurance: JourneyInsuranceService,
    private readonly payment: JourneyPaymentService,
    private readonly contract: JourneyContractService,
    private readonly transfer: OwnershipTransferService,
    private readonly delivery: JourneyDeliveryService,
    private readonly audit: JourneyAuditService,
    private readonly completion: CompletionPolicy,
  ) {}

  create(input: { buyerId: string; sellerId: string; vehicleId: string; askingPrice: number }) {
    const now = new Date().toISOString();
    const journey = {
      id: makeJourneyId("journey"),
      ...input,
      stage: "DISCOVERY" as const,
      timeline: [{ stage: "DISCOVERY" as const, note: "Journey created", createdAt: now }],
      createdAt: now,
      updatedAt: now,
    };
    this.repo.save(journey);
    this.audit.record("JOURNEY_CREATED", journey.id);
    return journey;
  }

  reserve(id: string, input: { amount: number; expiresInHours?: number }) {
    const journey = this.repo.get(id);
    const reservation = this.reservation.create({ journeyId: id, ...input });
    journey.reservationId = reservation.id;
    this.timeline.add(journey, "RESERVED", "Vehicle reserved");
    return { journey, reservation };
  }

  negotiate(id: string, input: { actor: string; amount: number; message?: string; accept?: boolean }) {
    const journey = this.repo.get(id);
    const offer = this.negotiation.submit({ askingPrice: journey.askingPrice, ...input });
    if (input.accept) journey.agreedPrice = input.amount;
    this.timeline.add(journey, "NEGOTIATING", input.accept ? "Offer accepted" : "Offer submitted");
    return { journey, offer };
  }

  bookInspection(id: string, input: { centerId: string; preferredDate: string }) {
    const journey = this.repo.get(id);
    const inspection = this.inspection.book({ journeyId: id, ...input });
    journey.inspectionId = inspection.id;
    this.timeline.add(journey, "INSPECTION", "Inspection booked");
    return { journey, inspection };
  }

  submitFinance(id: string, input: any) {
    const journey = this.repo.get(id);
    const application = this.finance.submit({ journeyId: id, ...input });
    journey.financeApplicationId = application.id;
    this.timeline.add(journey, "FINANCING", "Finance application submitted");
    return { journey, application };
  }

  requestInsurance(id: string, input: any) {
    const journey = this.repo.get(id);
    const quote = this.insurance.request({ journeyId: id, ...input });
    journey.insuranceQuoteId = quote.id;
    this.timeline.add(journey, "INSURANCE", "Insurance quote requested");
    return { journey, quote };
  }

  pay(id: string, input: { amount: number; method: string }) {
    const journey = this.repo.get(id);
    const payment = this.payment.create({ journeyId: id, ...input });
    journey.paymentId = payment.id;
    this.timeline.add(journey, "PAYMENT", "Payment completed");
    return { journey, payment };
  }

  createContract(id: string, input: { buyerAccepted: boolean; sellerAccepted: boolean }) {
    const journey = this.repo.get(id);
    const contract = this.contract.create({ journeyId: id, ...input });
    journey.contractId = contract.id;
    this.timeline.add(journey, "CONTRACT", "Contract created");
    return { journey, contract };
  }

  transferOwnership(id: string, input: { authority: string; reference?: string }) {
    const journey = this.repo.get(id);
    const transfer = this.transfer.create({ journeyId: id, ...input });
    journey.transferId = transfer.id;
    this.timeline.add(journey, "TRANSFER", "Ownership transferred");
    return { journey, transfer };
  }

  scheduleDelivery(id: string, input: { address: string; scheduledAt: string }) {
    const journey = this.repo.get(id);
    const delivery = this.delivery.schedule({ journeyId: id, ...input });
    journey.deliveryId = delivery.id;
    this.timeline.add(journey, "DELIVERY", "Delivery scheduled");
    if (this.completion.canComplete(journey)) {
      this.timeline.add(journey, "COMPLETED", "Journey completed");
    }
    return { journey, delivery };
  }

  get(id: string) { return this.repo.get(id); }
  list() { return this.repo.list(); }
}

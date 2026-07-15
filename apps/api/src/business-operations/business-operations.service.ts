import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import {
  BusinessOperationsDashboard,
  BusinessPayment,
  LoyaltyAccount,
  PartsOrder,
  ReferralRecord,
  SupportTicket,
  WarrantyClaim,
  WarrantyRecord,
  WorkshopBooking,
} from "./business-operations.types";

@Injectable()
export class BusinessOperationsService {
  private readonly bookings = new Map<string, WorkshopBooking>();
  private readonly warranties = new Map<string, WarrantyRecord>();
  private readonly claims = new Map<string, WarrantyClaim>();
  private readonly partsOrders = new Map<string, PartsOrder>();
  private readonly tickets = new Map<string, SupportTicket>();
  private readonly loyalty = new Map<string, LoyaltyAccount>();
  private readonly referrals = new Map<string, ReferralRecord>();
  private readonly payments = new Map<string, BusinessPayment>();

  createWorkshopBooking(
    input: Omit<WorkshopBooking, "id" | "status" | "createdAt">,
  ): WorkshopBooking {
    const booking: WorkshopBooking = {
      ...input,
      id: randomUUID(),
      status: "REQUESTED",
      createdAt: new Date().toISOString(),
    };

    this.bookings.set(booking.id, booking);
    return { ...booking };
  }

  updateWorkshopBooking(
    id: string,
    status: WorkshopBooking["status"],
  ): WorkshopBooking {
    const booking = this.bookings.get(id);
    if (!booking) throw new Error(`Workshop booking not found: ${id}`);

    booking.status = status;
    this.bookings.set(id, booking);
    return { ...booking };
  }

  createWarranty(
    input: Omit<WarrantyRecord, "id" | "status" | "createdAt">,
  ): WarrantyRecord {
    const warranty: WarrantyRecord = {
      ...input,
      id: randomUUID(),
      status: "ACTIVE",
      createdAt: new Date().toISOString(),
    };

    this.warranties.set(warranty.id, warranty);
    return { ...warranty };
  }

  createWarrantyClaim(
    input: Omit<WarrantyClaim, "id" | "status" | "createdAt">,
  ): WarrantyClaim {
    const warranty = this.warranties.get(input.warrantyId);
    if (!warranty || warranty.status !== "ACTIVE") {
      throw new Error("Active warranty is required");
    }

    const claim: WarrantyClaim = {
      ...input,
      id: randomUUID(),
      status: "CLAIMED",
      createdAt: new Date().toISOString(),
    };

    this.claims.set(claim.id, claim);
    warranty.status = "CLAIMED";
    this.warranties.set(warranty.id, warranty);

    return { ...claim };
  }

  updateWarrantyClaim(
    id: string,
    status: WarrantyClaim["status"],
  ): WarrantyClaim {
    const claim = this.claims.get(id);
    if (!claim) throw new Error(`Warranty claim not found: ${id}`);

    claim.status = status;
    this.claims.set(id, claim);
    return { ...claim };
  }

  createPartsOrder(
    input: Omit<PartsOrder, "id" | "total" | "createdAt">,
  ): PartsOrder {
    if (input.quantity <= 0 || input.unitPrice < 0) {
      throw new Error("Invalid parts order values");
    }

    const order: PartsOrder = {
      ...input,
      id: randomUUID(),
      total: Number((input.quantity * input.unitPrice).toFixed(2)),
      createdAt: new Date().toISOString(),
    };

    this.partsOrders.set(order.id, order);
    return { ...order };
  }

  createSupportTicket(
    input: Omit<SupportTicket, "id" | "status" | "createdAt">,
  ): SupportTicket {
    const ticket: SupportTicket = {
      ...input,
      id: randomUUID(),
      status: "OPEN",
      createdAt: new Date().toISOString(),
    };

    this.tickets.set(ticket.id, ticket);
    return { ...ticket };
  }

  updateSupportTicket(
    id: string,
    status: SupportTicket["status"],
  ): SupportTicket {
    const ticket = this.tickets.get(id);
    if (!ticket) throw new Error(`Support ticket not found: ${id}`);

    ticket.status = status;
    this.tickets.set(id, ticket);
    return { ...ticket };
  }

  awardLoyaltyPoints(customerId: string, points: number): LoyaltyAccount {
    if (points <= 0) throw new Error("Points must be positive");

    const current = this.loyalty.get(customerId) ?? {
      customerId,
      points: 0,
      tier: "BRONZE" as const,
      updatedAt: new Date().toISOString(),
    };

    current.points += points;
    current.tier =
      current.points >= 10000
        ? "PLATINUM"
        : current.points >= 5000
          ? "GOLD"
          : current.points >= 1000
            ? "SILVER"
            : "BRONZE";
    current.updatedAt = new Date().toISOString();

    this.loyalty.set(customerId, current);
    return { ...current };
  }

  createReferral(
    input: Omit<ReferralRecord, "id" | "createdAt">,
  ): ReferralRecord {
    const referral: ReferralRecord = {
      ...input,
      id: randomUUID(),
      createdAt: new Date().toISOString(),
    };

    this.referrals.set(referral.id, referral);
    this.awardLoyaltyPoints(input.referrerId, input.rewardPoints);

    return { ...referral };
  }

  createPayment(
    input: Omit<BusinessPayment, "id" | "status" | "createdAt">,
  ): BusinessPayment {
    if (input.amount <= 0) throw new Error("Payment amount must be positive");

    const payment: BusinessPayment = {
      ...input,
      id: randomUUID(),
      status: "PENDING",
      createdAt: new Date().toISOString(),
    };

    this.payments.set(payment.id, payment);
    return { ...payment };
  }

  updatePaymentStatus(
    id: string,
    status: BusinessPayment["status"],
  ): BusinessPayment {
    const payment = this.payments.get(id);
    if (!payment) throw new Error(`Payment not found: ${id}`);

    payment.status = status;
    this.payments.set(id, payment);
    return { ...payment };
  }

  dashboard(): BusinessOperationsDashboard {
    return {
      workshopBookings: this.bookings.size,
      activeWarranties: Array.from(this.warranties.values()).filter(
        (item) => item.status === "ACTIVE",
      ).length,
      warrantyClaims: this.claims.size,
      partsOrders: this.partsOrders.size,
      supportTickets: this.tickets.size,
      loyaltyAccounts: this.loyalty.size,
      referrals: this.referrals.size,
      payments: this.payments.size,
      generatedAt: new Date().toISOString(),
    };
  }
}
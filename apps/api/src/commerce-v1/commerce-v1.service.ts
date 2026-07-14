import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import {
  FinanceOffer,
  InsuranceQuote,
  PaymentRecord,
  ShipmentRequest,
  WorkshopBooking,
} from "./commerce-v1.types";

@Injectable()
export class CommerceV1Service {
  private readonly insuranceQuotes: InsuranceQuote[] = [];
  private readonly financeOffers: FinanceOffer[] = [];
  private readonly workshopBookings: WorkshopBooking[] = [];
  private readonly shipments: ShipmentRequest[] = [];
  private readonly payments: PaymentRecord[] = [];
  private readonly notifications: Array<{
    id: string;
    title: string;
    message: string;
    createdAt: string;
  }> = [];

  createInsuranceQuote(provider = "AVOS Insurance", annualPremium = 5900): InsuranceQuote {
    const quote: InsuranceQuote = {
      id: randomUUID(),
      provider,
      annualPremium,
      coverage: "Comprehensive",
      status: "APPROVED",
      createdAt: new Date().toISOString(),
    };
    this.insuranceQuotes.push(quote);
    this.notify("Insurance quote approved", `${provider}: AED ${annualPremium}`);
    return quote;
  }

  createFinanceOffer(bank = "AVOS Bank", vehiclePrice = 289000): FinanceOffer {
    const termMonths = 60;
    const rate = 3.2;
    const monthlyInstallment = Math.round((vehiclePrice * (1 + rate / 100)) / termMonths);

    const offer: FinanceOffer = {
      id: randomUUID(),
      bank,
      monthlyInstallment,
      rate,
      termMonths,
      status: "APPROVED",
      createdAt: new Date().toISOString(),
    };
    this.financeOffers.push(offer);
    this.notify("Finance offer approved", `${bank}: AED ${monthlyInstallment}/month`);
    return offer;
  }

  bookWorkshop(
    workshop = "AVOS Certified Workshop",
    service = "Full Inspection",
  ): WorkshopBooking {
    const booking: WorkshopBooking = {
      id: randomUUID(),
      workshop,
      service,
      scheduledAt: new Date(Date.now() + 86_400_000).toISOString(),
      status: "IN_PROGRESS",
      createdAt: new Date().toISOString(),
    };
    this.workshopBookings.push(booking);
    this.notify("Workshop booking created", `${workshop}: ${service}`);
    return booking;
  }

  createShipment(
    destination = "Riyadh, Saudi Arabia",
    provider = "AVOS Logistics",
  ): ShipmentRequest {
    const shipment: ShipmentRequest = {
      id: randomUUID(),
      destination,
      provider,
      price: 7500,
      trackingCode: `AVOS-${Date.now()}`,
      status: "IN_PROGRESS",
      createdAt: new Date().toISOString(),
    };
    this.shipments.push(shipment);
    this.notify("Shipment created", `${provider}: ${shipment.trackingCode}`);
    return shipment;
  }

  createPayment(reference = "vehicle-order-001", amount = 25000): PaymentRecord {
    const payment: PaymentRecord = {
      id: randomUUID(),
      reference,
      amount,
      currency: "AED",
      status: "COMPLETED",
      createdAt: new Date().toISOString(),
    };
    this.payments.push(payment);
    this.notify("Payment completed", `${reference}: AED ${amount}`);
    return payment;
  }

  listNotifications() {
    return [...this.notifications];
  }

  snapshot() {
    return {
      insuranceQuotes: this.insuranceQuotes.length,
      financeOffers: this.financeOffers.length,
      workshopBookings: this.workshopBookings.length,
      shipments: this.shipments.length,
      payments: this.payments.length,
      notifications: this.notifications.length,
    };
  }

  private notify(title: string, message: string) {
    this.notifications.push({
      id: randomUUID(),
      title,
      message,
      createdAt: new Date().toISOString(),
    });
  }
}
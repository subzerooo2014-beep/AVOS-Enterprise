import { Body, Controller, Get, Post } from "@nestjs/common";
import { CommerceV1Service } from "./commerce-v1.service";

@Controller("commerce-v1")
export class CommerceV1Controller {
  constructor(private readonly commerce: CommerceV1Service) {}

  @Post("insurance")
  insurance(@Body() body: { provider?: string; annualPremium?: number }) {
    return this.commerce.createInsuranceQuote(
      body?.provider,
      body?.annualPremium,
    );
  }

  @Post("finance")
  finance(@Body() body: { bank?: string; vehiclePrice?: number }) {
    return this.commerce.createFinanceOffer(body?.bank, body?.vehiclePrice);
  }

  @Post("workshops")
  workshops(@Body() body: { workshop?: string; service?: string }) {
    return this.commerce.bookWorkshop(body?.workshop, body?.service);
  }

  @Post("shipments")
  shipments(@Body() body: { destination?: string; provider?: string }) {
    return this.commerce.createShipment(body?.destination, body?.provider);
  }

  @Post("payments")
  payments(@Body() body: { reference?: string; amount?: number }) {
    return this.commerce.createPayment(body?.reference, body?.amount);
  }

  @Get("notifications")
  notifications() {
    return this.commerce.listNotifications();
  }

  @Get("snapshot")
  snapshot() {
    return this.commerce.snapshot();
  }

  @Post("smoke")
  smoke() {
    const insurance = this.commerce.createInsuranceQuote();
    const finance = this.commerce.createFinanceOffer();
    const workshop = this.commerce.bookWorkshop();
    const shipment = this.commerce.createShipment();
    const payment = this.commerce.createPayment();
    const snapshot = this.commerce.snapshot();

    return {
      success:
        insurance.status === "APPROVED" &&
        finance.status === "APPROVED" &&
        workshop.status === "IN_PROGRESS" &&
        shipment.status === "IN_PROGRESS" &&
        payment.status === "COMPLETED",
      system: "AVOS Commerce Mega Pack",
      integrationStatus: "running",
      insuranceStatus: insurance.status,
      financeStatus: finance.status,
      workshopStatus: workshop.status,
      shipmentStatus: shipment.status,
      paymentStatus: payment.status,
      notifications: snapshot.notifications,
      capabilities: 6,
    };
  }
}
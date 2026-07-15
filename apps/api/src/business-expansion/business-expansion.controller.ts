import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { BusinessExpansionService } from "./business-expansion.service";
import {
  Auction,
  AuctionBid,
  DealerLead,
  FinanceApplication,
  InspectionRequest,
  InsuranceQuote,
  MonetizationTransaction,
  Shipment,
} from "./business-expansion.types";

@Controller("business-expansion")
export class BusinessExpansionController {
  constructor(private readonly business: BusinessExpansionService) {}

  @Post("auctions")
  createAuction(@Body() input: Omit<Auction, "id" | "currentBid" | "status" | "createdAt">) {
    return this.business.createAuction(input);
  }

  @Patch("auctions/:id/start")
  startAuction(@Param("id") id: string) {
    return this.business.startAuction(id);
  }

  @Post("auctions/bids")
  placeBid(@Body() input: Omit<AuctionBid, "id" | "createdAt">) {
    return this.business.placeBid(input);
  }

  @Patch("auctions/:id/end")
  endAuction(@Param("id") id: string) {
    return this.business.endAuction(id);
  }

  @Post("finance")
  createFinance(
    @Body()
    input: Omit<FinanceApplication, "id" | "monthlyPayment" | "status" | "createdAt">,
  ) {
    return this.business.createFinanceApplication(input);
  }

  @Patch("finance/:id/status")
  updateFinanceStatus(
    @Param("id") id: string,
    @Body() body: { status: FinanceApplication["status"] },
  ) {
    return this.business.updateFinanceStatus(id, body.status);
  }

  @Post("insurance")
  createInsurance(
    @Body()
    input: Omit<InsuranceQuote, "id" | "status" | "createdAt">,
  ) {
    return this.business.createInsuranceQuote(input);
  }

  @Patch("insurance/:id/select")
  selectInsurance(@Param("id") id: string) {
    return this.business.selectInsuranceQuote(id);
  }

  @Post("inspections")
  createInspection(
    @Body()
    input: Omit<InspectionRequest, "id" | "status" | "createdAt">,
  ) {
    return this.business.createInspection(input);
  }

  @Patch("inspections/:id/complete")
  completeInspection(
    @Param("id") id: string,
    @Body() body: { score: number; notes?: string },
  ) {
    return this.business.completeInspection(id, body);
  }

  @Post("shipments")
  createShipment(
    @Body()
    input: Omit<Shipment, "id" | "status" | "createdAt">,
  ) {
    return this.business.createShipment(input);
  }

  @Patch("shipments/:id/status")
  updateShipmentStatus(
    @Param("id") id: string,
    @Body() body: { status: Shipment["status"]; trackingNumber?: string },
  ) {
    return this.business.updateShipmentStatus(id, body);
  }

  @Post("dealer/leads")
  createLead(@Body() input: Omit<DealerLead, "id" | "status" | "createdAt">) {
    return this.business.createLead(input);
  }

  @Patch("dealer/leads/:id/status")
  updateLeadStatus(
    @Param("id") id: string,
    @Body() body: { status: DealerLead["status"] },
  ) {
    return this.business.updateLeadStatus(id, body.status);
  }

  @Post("monetization")
  recordMonetization(
    @Body()
    input: Omit<MonetizationTransaction, "id" | "createdAt">,
  ) {
    return this.business.recordMonetization(input);
  }

  @Get("dashboard")
  dashboard() {
    return this.business.dashboard();
  }
}
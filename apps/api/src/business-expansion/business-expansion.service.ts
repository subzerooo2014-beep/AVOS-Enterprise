import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import {
  Auction,
  AuctionBid,
  BusinessExpansionDashboard,
  DealerLead,
  FinanceApplication,
  InspectionRequest,
  InsuranceQuote,
  MonetizationTransaction,
  Shipment,
} from "./business-expansion.types";

@Injectable()
export class BusinessExpansionService {
  private readonly auctions = new Map<string, Auction>();
  private readonly bids = new Map<string, AuctionBid>();
  private readonly finance = new Map<string, FinanceApplication>();
  private readonly insurance = new Map<string, InsuranceQuote>();
  private readonly inspections = new Map<string, InspectionRequest>();
  private readonly shipments = new Map<string, Shipment>();
  private readonly leads = new Map<string, DealerLead>();
  private readonly monetization = new Map<string, MonetizationTransaction>();

  createAuction(input: Omit<Auction, "id" | "currentBid" | "status" | "createdAt">): Auction {
    if (input.reservePrice <= 0) throw new Error("reservePrice must be positive");

    const auction: Auction = {
      ...input,
      id: randomUUID(),
      currentBid: 0,
      status: "SCHEDULED",
      createdAt: new Date().toISOString(),
    };

    this.auctions.set(auction.id, auction);
    return { ...auction };
  }

  startAuction(id: string): Auction {
    const auction = this.requireAuction(id);
    auction.status = "LIVE";
    this.auctions.set(id, auction);
    return { ...auction };
  }

  placeBid(input: Omit<AuctionBid, "id" | "createdAt">): AuctionBid {
    const auction = this.requireAuction(input.auctionId);

    if (auction.status !== "LIVE") throw new Error("Auction is not live");
    if (input.amount <= auction.currentBid) throw new Error("Bid must exceed current bid");

    const bid: AuctionBid = {
      ...input,
      id: randomUUID(),
      createdAt: new Date().toISOString(),
    };

    auction.currentBid = input.amount;
    this.auctions.set(auction.id, auction);
    this.bids.set(bid.id, bid);

    return { ...bid };
  }

  endAuction(id: string): Auction {
    const auction = this.requireAuction(id);
    auction.status = "ENDED";
    this.auctions.set(id, auction);
    return { ...auction };
  }

  createFinanceApplication(
    input: Omit<FinanceApplication, "id" | "monthlyPayment" | "status" | "createdAt">,
  ): FinanceApplication {
    if (input.requestedAmount <= 0 || input.termMonths <= 0) {
      throw new Error("Invalid finance values");
    }

    const principal = Math.max(input.requestedAmount - input.downPayment, 0);
    const monthlyRate = input.annualRate / 100 / 12;
    const monthlyPayment =
      monthlyRate === 0
        ? principal / input.termMonths
        : (principal * monthlyRate) /
          (1 - Math.pow(1 + monthlyRate, -input.termMonths));

    const application: FinanceApplication = {
      ...input,
      id: randomUUID(),
      monthlyPayment: Number(monthlyPayment.toFixed(2)),
      status: "SUBMITTED",
      createdAt: new Date().toISOString(),
    };

    this.finance.set(application.id, application);
    return { ...application };
  }

  updateFinanceStatus(id: string, status: FinanceApplication["status"]): FinanceApplication {
    const item = this.finance.get(id);
    if (!item) throw new Error(`Finance application not found: ${id}`);
    item.status = status;
    this.finance.set(id, item);
    return { ...item };
  }

  createInsuranceQuote(
    input: Omit<InsuranceQuote, "id" | "status" | "createdAt">,
  ): InsuranceQuote {
    if (input.premium <= 0) throw new Error("Premium must be positive");

    const quote: InsuranceQuote = {
      ...input,
      id: randomUUID(),
      status: "QUOTED",
      createdAt: new Date().toISOString(),
    };

    this.insurance.set(quote.id, quote);
    return { ...quote };
  }

  selectInsuranceQuote(id: string): InsuranceQuote {
    const quote = this.insurance.get(id);
    if (!quote) throw new Error(`Insurance quote not found: ${id}`);
    quote.status = "SELECTED";
    this.insurance.set(id, quote);
    return { ...quote };
  }

  createInspection(
    input: Omit<InspectionRequest, "id" | "status" | "createdAt">,
  ): InspectionRequest {
    const inspection: InspectionRequest = {
      ...input,
      id: randomUUID(),
      status: "REQUESTED",
      createdAt: new Date().toISOString(),
    };

    this.inspections.set(inspection.id, inspection);
    return { ...inspection };
  }

  completeInspection(
    id: string,
    body: { score: number; notes?: string },
  ): InspectionRequest {
    const inspection = this.inspections.get(id);
    if (!inspection) throw new Error(`Inspection not found: ${id}`);
    if (body.score < 0 || body.score > 100) throw new Error("Score must be 0-100");

    inspection.score = body.score;
    inspection.notes = body.notes;
    inspection.status = "COMPLETED";
    this.inspections.set(id, inspection);

    return { ...inspection };
  }

  createShipment(
    input: Omit<Shipment, "id" | "status" | "createdAt">,
  ): Shipment {
    if (input.shippingCost < 0) throw new Error("Invalid shipping cost");

    const shipment: Shipment = {
      ...input,
      id: randomUUID(),
      status: "CREATED",
      createdAt: new Date().toISOString(),
    };

    this.shipments.set(shipment.id, shipment);
    return { ...shipment };
  }

  updateShipmentStatus(
    id: string,
    body: { status: Shipment["status"]; trackingNumber?: string },
  ): Shipment {
    const shipment = this.shipments.get(id);
    if (!shipment) throw new Error(`Shipment not found: ${id}`);

    shipment.status = body.status;
    shipment.trackingNumber = body.trackingNumber ?? shipment.trackingNumber;
    this.shipments.set(id, shipment);

    return { ...shipment };
  }

  createLead(input: Omit<DealerLead, "id" | "status" | "createdAt">): DealerLead {
    const lead: DealerLead = {
      ...input,
      id: randomUUID(),
      status: "NEW",
      createdAt: new Date().toISOString(),
    };

    this.leads.set(lead.id, lead);
    return { ...lead };
  }

  updateLeadStatus(id: string, status: DealerLead["status"]): DealerLead {
    const lead = this.leads.get(id);
    if (!lead) throw new Error(`Lead not found: ${id}`);

    lead.status = status;
    this.leads.set(id, lead);
    return { ...lead };
  }

  recordMonetization(
    input: Omit<MonetizationTransaction, "id" | "createdAt">,
  ): MonetizationTransaction {
    if (input.amount < 0) throw new Error("Amount cannot be negative");

    const transaction: MonetizationTransaction = {
      ...input,
      id: randomUUID(),
      createdAt: new Date().toISOString(),
    };

    this.monetization.set(transaction.id, transaction);
    return { ...transaction };
  }

  dashboard(): BusinessExpansionDashboard {
    return {
      auctions: this.auctions.size,
      liveAuctions: Array.from(this.auctions.values()).filter(
        (item) => item.status === "LIVE",
      ).length,
      bids: this.bids.size,
      financeApplications: this.finance.size,
      approvedFinance: Array.from(this.finance.values()).filter(
        (item) => item.status === "APPROVED",
      ).length,
      insuranceQuotes: this.insurance.size,
      inspections: this.inspections.size,
      shipments: this.shipments.size,
      dealerLeads: this.leads.size,
      monetizationTransactions: this.monetization.size,
      generatedAt: new Date().toISOString(),
    };
  }

  private requireAuction(id: string): Auction {
    const auction = this.auctions.get(id);
    if (!auction) throw new Error(`Auction not found: ${id}`);
    return auction;
  }
}
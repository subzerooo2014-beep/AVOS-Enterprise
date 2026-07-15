import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import {
  CustomsCheck,
  ExportCase,
  ExportDocument,
  ExportStatus,
  LogisticsException,
  Shipment,
  ShippingQuote,
} from "./export-shipping.types";
import { EXPORT_SHIPPING_CAPABILITIES } from "./export-shipping.registry";

@Injectable()
export class ExportShippingService {
  private readonly cases = new Map<string, ExportCase>();
  private readonly quotes = new Map<string, ShippingQuote>();
  private readonly documents = new Map<string, ExportDocument>();
  private readonly customsChecks = new Map<string, CustomsCheck>();
  private readonly shipments = new Map<string, Shipment>();
  private readonly exceptions = new Map<string, LogisticsException>();

  capabilities() {
    return {
      system: "AVOS Export, Shipping & Customs",
      capabilities: [...EXPORT_SHIPPING_CAPABILITIES],
      status: "READY",
    };
  }

  createExportCase(
    input: Omit<ExportCase, "id" | "status" | "createdAt" | "updatedAt">,
  ): ExportCase {
    const now = new Date().toISOString();

    const exportCase: ExportCase = {
      ...input,
      id: randomUUID(),
      status: "DRAFT",
      metadata: { ...input.metadata },
      createdAt: now,
      updatedAt: now,
    };

    this.cases.set(exportCase.id, exportCase);
    return this.cloneCase(exportCase);
  }

  updateExportStatus(
    id: string,
    status: ExportStatus,
  ): ExportCase {
    const exportCase = this.requireCase(id);
    exportCase.status = status;
    exportCase.updatedAt = new Date().toISOString();
    this.cases.set(id, exportCase);
    return this.cloneCase(exportCase);
  }

  createShippingQuote(
    input: Omit<ShippingQuote, "id" | "status" | "createdAt" | "updatedAt">,
  ): ShippingQuote {
    this.requireCase(input.exportCaseId);

    if (input.amount <= 0 || input.estimatedDays <= 0) {
      throw new Error("Invalid shipping quote values");
    }

    const now = new Date().toISOString();

    const quote: ShippingQuote = {
      ...input,
      id: randomUUID(),
      status: "QUOTED",
      createdAt: now,
      updatedAt: now,
    };

    this.quotes.set(quote.id, quote);
    return { ...quote };
  }

  acceptQuote(id: string): ShippingQuote {
    const quote = this.requireQuote(id);
    quote.status = "ACCEPTED";
    quote.updatedAt = new Date().toISOString();
    this.quotes.set(id, quote);
    return { ...quote };
  }

  addDocument(
    input: Omit<ExportDocument, "id" | "verified" | "createdAt" | "updatedAt">,
  ): ExportDocument {
    this.requireCase(input.exportCaseId);

    const now = new Date().toISOString();

    const document: ExportDocument = {
      ...input,
      id: randomUUID(),
      verified: false,
      createdAt: now,
      updatedAt: now,
    };

    this.documents.set(document.id, document);
    return { ...document };
  }

  verifyDocument(id: string): ExportDocument {
    const document = this.requireDocument(id);
    document.verified = true;
    document.updatedAt = new Date().toISOString();
    this.documents.set(id, document);
    return { ...document };
  }

  runCustomsCheck(
    exportCaseId: string,
    authority: string,
    passed: boolean,
    review: boolean,
    findings: string[],
  ): CustomsCheck {
    const exportCase = this.requireCase(exportCaseId);

    const status: CustomsCheck["status"] =
      review ? "REVIEW" : passed ? "PASS" : "FAIL";

    const now = new Date().toISOString();

    const check: CustomsCheck = {
      id: randomUUID(),
      exportCaseId,
      authority,
      status,
      findings: [...findings],
      createdAt: now,
      updatedAt: now,
    };

    this.customsChecks.set(check.id, check);

    exportCase.status =
      status === "PASS"
        ? "CLEARED"
        : status === "REVIEW"
          ? "CUSTOMS_REVIEW"
          : "DOCUMENTS_PENDING";

    exportCase.updatedAt = now;
    this.cases.set(exportCase.id, exportCase);

    return { ...check, findings: [...check.findings] };
  }

  createShipment(
    exportCaseId: string,
    quoteId: string,
    trackingNumber: string,
  ): Shipment {
    const exportCase = this.requireCase(exportCaseId);
    const quote = this.requireQuote(quoteId);

    if (quote.exportCaseId !== exportCaseId) {
      throw new Error("Quote does not belong to export case");
    }

    if (quote.status !== "ACCEPTED") {
      throw new Error("Shipping quote must be accepted");
    }

    const now = new Date().toISOString();

    const shipment: Shipment = {
      id: randomUUID(),
      exportCaseId,
      carrierId: quote.carrierId,
      quoteId,
      trackingNumber,
      status: "CREATED",
      events: [],
      createdAt: now,
      updatedAt: now,
    };

    this.shipments.set(shipment.id, shipment);

    exportCase.status = "IN_TRANSIT";
    exportCase.updatedAt = now;
    this.cases.set(exportCase.id, exportCase);

    return this.cloneShipment(shipment);
  }

  trackShipment(
    id: string,
    status: Shipment["status"],
    location: string,
    message: string,
  ): Shipment {
    const shipment = this.requireShipment(id);

    shipment.status = status;
    shipment.updatedAt = new Date().toISOString();
    shipment.events.push({
      id: randomUUID(),
      status,
      location,
      message,
      createdAt: shipment.updatedAt,
    });

    this.shipments.set(id, shipment);

    if (status === "DELIVERED") {
      const exportCase = this.requireCase(shipment.exportCaseId);
      exportCase.status = "DELIVERED";
      exportCase.updatedAt = shipment.updatedAt;
      this.cases.set(exportCase.id, exportCase);
    }

    return this.cloneShipment(shipment);
  }

  createException(
    input: Omit<LogisticsException, "id" | "resolved" | "createdAt">,
  ): LogisticsException {
    this.requireCase(input.exportCaseId);

    const exception: LogisticsException = {
      ...input,
      id: randomUUID(),
      resolved: false,
      createdAt: new Date().toISOString(),
    };

    this.exceptions.set(exception.id, exception);

    if (exception.shipmentId) {
      const shipment = this.requireShipment(exception.shipmentId);
      shipment.status = "EXCEPTION";
      shipment.updatedAt = new Date().toISOString();
      this.shipments.set(shipment.id, shipment);
    }

    return { ...exception };
  }

  resolveException(id: string): LogisticsException {
    const exception = this.requireException(id);
    exception.resolved = true;
    exception.resolvedAt = new Date().toISOString();
    this.exceptions.set(id, exception);
    return { ...exception };
  }

  dashboard() {
    const cases = Array.from(this.cases.values());
    const shipments = Array.from(this.shipments.values());

    return {
      system: "AVOS Export, Shipping & Customs",
      exportCases: cases.length,
      clearedCases: cases.filter((item) => item.status === "CLEARED").length,
      deliveredCases: cases.filter((item) => item.status === "DELIVERED").length,
      shippingQuotes: this.quotes.size,
      documents: this.documents.size,
      verifiedDocuments: Array.from(this.documents.values()).filter(
        (item) => item.verified,
      ).length,
      customsChecks: this.customsChecks.size,
      shipments: shipments.length,
      deliveredShipments: shipments.filter(
        (item) => item.status === "DELIVERED",
      ).length,
      openExceptions: Array.from(this.exceptions.values()).filter(
        (item) => !item.resolved,
      ).length,
      generatedAt: new Date().toISOString(),
    };
  }

  private requireCase(id: string) {
    const value = this.cases.get(id);
    if (!value) throw new Error(`Export case not found: ${id}`);
    return value;
  }

  private requireQuote(id: string) {
    const value = this.quotes.get(id);
    if (!value) throw new Error(`Shipping quote not found: ${id}`);
    return value;
  }

  private requireDocument(id: string) {
    const value = this.documents.get(id);
    if (!value) throw new Error(`Export document not found: ${id}`);
    return value;
  }

  private requireShipment(id: string) {
    const value = this.shipments.get(id);
    if (!value) throw new Error(`Shipment not found: ${id}`);
    return value;
  }

  private requireException(id: string) {
    const value = this.exceptions.get(id);
    if (!value) throw new Error(`Logistics exception not found: ${id}`);
    return value;
  }

  private cloneCase(value: ExportCase): ExportCase {
    return {
      ...value,
      metadata: { ...value.metadata },
    };
  }

  private cloneShipment(value: Shipment): Shipment {
    return {
      ...value,
      events: value.events.map((event) => ({ ...event })),
    };
  }
}
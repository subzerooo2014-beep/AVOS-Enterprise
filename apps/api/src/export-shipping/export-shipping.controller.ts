import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { ExportShippingService } from "./export-shipping.service";
import {
  ExportCase,
  ExportDocument,
  ExportStatus,
  LogisticsException,
  Shipment,
  ShippingQuote,
} from "./export-shipping.types";

@Controller("export-shipping")
export class ExportShippingController {
  constructor(private readonly exportShipping: ExportShippingService) {}

  @Get("capabilities")
  capabilities() {
    return this.exportShipping.capabilities();
  }

  @Post("cases")
  createExportCase(
    @Body()
    input: Omit<ExportCase, "id" | "status" | "createdAt" | "updatedAt">,
  ) {
    return this.exportShipping.createExportCase(input);
  }

  @Patch("cases/:id/status")
  updateExportStatus(
    @Param("id") id: string,
    @Body() body: { status: ExportStatus },
  ) {
    return this.exportShipping.updateExportStatus(id, body.status);
  }

  @Post("quotes")
  createShippingQuote(
    @Body()
    input: Omit<ShippingQuote, "id" | "status" | "createdAt" | "updatedAt">,
  ) {
    return this.exportShipping.createShippingQuote(input);
  }

  @Patch("quotes/:id/accept")
  acceptQuote(@Param("id") id: string) {
    return this.exportShipping.acceptQuote(id);
  }

  @Post("documents")
  addDocument(
    @Body()
    input: Omit<ExportDocument, "id" | "verified" | "createdAt" | "updatedAt">,
  ) {
    return this.exportShipping.addDocument(input);
  }

  @Patch("documents/:id/verify")
  verifyDocument(@Param("id") id: string) {
    return this.exportShipping.verifyDocument(id);
  }

  @Post("customs/checks")
  runCustomsCheck(
    @Body()
    body: {
      exportCaseId: string;
      authority: string;
      passed: boolean;
      review: boolean;
      findings: string[];
    },
  ) {
    return this.exportShipping.runCustomsCheck(
      body.exportCaseId,
      body.authority,
      body.passed,
      body.review,
      body.findings,
    );
  }

  @Post("shipments")
  createShipment(
    @Body()
    body: {
      exportCaseId: string;
      quoteId: string;
      trackingNumber: string;
    },
  ) {
    return this.exportShipping.createShipment(
      body.exportCaseId,
      body.quoteId,
      body.trackingNumber,
    );
  }

  @Patch("shipments/:id/track")
  trackShipment(
    @Param("id") id: string,
    @Body()
    body: {
      status: Shipment["status"];
      location: string;
      message: string;
    },
  ) {
    return this.exportShipping.trackShipment(
      id,
      body.status,
      body.location,
      body.message,
    );
  }

  @Post("exceptions")
  createException(
    @Body()
    input: Omit<LogisticsException, "id" | "resolved" | "createdAt">,
  ) {
    return this.exportShipping.createException(input);
  }

  @Patch("exceptions/:id/resolve")
  resolveException(@Param("id") id: string) {
    return this.exportShipping.resolveException(id);
  }

  @Get("dashboard")
  dashboard() {
    return this.exportShipping.dashboard();
  }
}
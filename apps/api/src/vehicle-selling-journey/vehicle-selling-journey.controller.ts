import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { VehicleSellingJourneyService } from "./vehicle-selling-journey.service";
import { SellerDashboardService } from "./services/seller-dashboard.service";
import { SellerAuditService } from "./services/seller-audit.service";
import { SellerFeedbackService } from "./services/seller-feedback.service";

@Controller("vehicle-selling-journey")
export class VehicleSellingJourneyController {
  constructor(
    private readonly selling: VehicleSellingJourneyService,
    private readonly dashboard: SellerDashboardService,
    private readonly audit: SellerAuditService,
    private readonly feedback: SellerFeedbackService,
  ) {}

  @Get("health")
  health() {
    return {
      success: true,
      system: "AVOS Vehicle Selling Journey",
      status: "healthy",
    };
  }

  @Post()
  create(@Body() body: any) {
    return { success: true, record: this.selling.create(body) };
  }

  @Get()
  list() {
    return { success: true, records: this.selling.list() };
  }

  @Get(":id")
  get(@Param("id") id: string) {
    return { success: true, record: this.selling.get(id) };
  }

  @Post(":id/media")
  uploadMedia(@Param("id") id: string, @Body() body: any) {
    return {
      success: true,
      ...this.selling.uploadMedia(id, body.mediaUrls),
    };
  }

  @Post(":id/media/analyze")
  analyzeMedia(@Param("id") id: string, @Body() body: any) {
    return {
      success: true,
      ...this.selling.analyzeMedia(id, body.mediaUrls),
    };
  }

  @Post(":id/pricing")
  price(@Param("id") id: string, @Body() body: any) {
    return { success: true, ...this.selling.price(id, body) };
  }

  @Post(":id/optimize")
  optimize(@Param("id") id: string, @Body() body: any) {
    return { success: true, ...this.selling.optimize(id, body) };
  }

  @Post(":id/publish")
  publish(@Param("id") id: string, @Body() body: any) {
    return {
      success: true,
      ...this.selling.publish(id, body.channels),
    };
  }

  @Post(":id/leads")
  lead(@Param("id") id: string, @Body() body: any) {
    return { success: true, ...this.selling.addLead(id, body) };
  }

  @Post(":id/offers")
  offer(@Param("id") id: string, @Body() body: any) {
    return { success: true, ...this.selling.addOffer(id, body) };
  }

  @Post(":id/negotiate")
  negotiate(@Param("id") id: string, @Body() body: any) {
    return { success: true, ...this.selling.negotiate(id, body) };
  }

  @Post(":id/reserve")
  reserve(@Param("id") id: string, @Body() body: any) {
    return { success: true, ...this.selling.reserve(id, body) };
  }

  @Post(":id/sale")
  sale(@Param("id") id: string, @Body() body: any) {
    return { success: true, ...this.selling.completeSale(id, body) };
  }

  @Post(":id/handover")
  handover(@Param("id") id: string, @Body() body: any) {
    return {
      success: true,
      ...this.selling.scheduleHandover(id, body),
    };
  }

  @Post("feedback")
  sellerFeedback(@Body() body: any) {
    return {
      success: true,
      feedback: this.feedback.record(body),
    };
  }

  @Get("operations/dashboard")
  operations() {
    return {
      success: true,
      dashboard: this.dashboard.summary(),
    };
  }

  @Get("operations/audit")
  auditEntries() {
    return {
      success: true,
      entries: this.audit.list(),
    };
  }
}

import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { AuctionRuntimeService } from "./auction-runtime.service";
import { AuctionDashboardService } from "./services/auction-dashboard.service";
import { AuctionAuditService } from "./services/auction-audit.service";
import { AuctionFeedbackService } from "./services/auction-feedback.service";
import { AuctionReportingService } from "./services/auction-reporting.service";

@Controller("auction-runtime")
export class AuctionRuntimeController {
  constructor(
    private readonly runtime: AuctionRuntimeService,
    private readonly dashboard: AuctionDashboardService,
    private readonly audit: AuctionAuditService,
    private readonly feedback: AuctionFeedbackService,
    private readonly reporting: AuctionReportingService,
  ) {}

  @Get("health")
  health() {
    return {
      success: true,
      system: "AVOS Auction Runtime",
      status: "healthy",
    };
  }

  @Post()
  create(@Body() body: any) {
    return { success: true, auction: this.runtime.create(body) };
  }

  @Get()
  list() {
    return { success: true, auctions: this.runtime.list() };
  }

  @Get(":id")
  get(@Param("id") id: string) {
    return { success: true, auction: this.runtime.get(id) };
  }

  @Post(":id/schedule")
  schedule(@Param("id") id: string) {
    return { success: true, auction: this.runtime.schedule(id) };
  }

  @Post(":id/start")
  start(@Param("id") id: string) {
    return { success: true, auction: this.runtime.start(id) };
  }

  @Post(":id/participants")
  participant(@Param("id") id: string, @Body() body: any) {
    return {
      success: true,
      ...this.runtime.registerParticipant(id, body),
    };
  }

  @Post(":id/bids")
  bid(@Param("id") id: string, @Body() body: any) {
    return { success: true, ...this.runtime.placeBid(id, body) };
  }

  @Post(":id/auto-bid")
  autoBid(@Param("id") id: string, @Body() body: any) {
    return {
      success: true,
      ...this.runtime.configureAutoBid(id, body),
    };
  }

  @Post(":id/extend")
  extend(@Param("id") id: string, @Body() body: any) {
    return {
      success: true,
      auction: this.runtime.extend(id, body.seconds),
    };
  }

  @Post(":id/end")
  end(@Param("id") id: string) {
    return { success: true, auction: this.runtime.end(id) };
  }

  @Post(":id/settle")
  settle(@Param("id") id: string, @Body() body: any) {
    return { success: true, ...this.runtime.settle(id, body) };
  }

  @Post("feedback")
  recordFeedback(@Body() body: any) {
    return {
      success: true,
      feedback: this.feedback.record(body),
    };
  }

  @Post("reports")
  report(@Body() body: any) {
    return {
      success: true,
      report: this.reporting.create(body),
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

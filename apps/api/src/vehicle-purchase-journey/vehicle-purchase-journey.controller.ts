import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { VehiclePurchaseJourneyService } from "./vehicle-purchase-journey.service";
import { JourneyDashboardService } from "./services/journey-dashboard.service";
import { JourneyAuditService } from "./services/audit.service";
import { JourneyFeedbackService } from "./services/feedback.service";

@Controller("vehicle-purchase-journey")
export class VehiclePurchaseJourneyController {
  constructor(
    private readonly journey: VehiclePurchaseJourneyService,
    private readonly dashboard: JourneyDashboardService,
    private readonly audit: JourneyAuditService,
    private readonly feedback: JourneyFeedbackService,
  ) {}

  @Get("health") health() { return { success: true, system: "AVOS Vehicle Purchase Journey", status: "healthy" }; }
  @Post() create(@Body() body: any) { return { success: true, journey: this.journey.create(body) }; }
  @Get() list() { return { success: true, journeys: this.journey.list() }; }
  @Get(":id") get(@Param("id") id: string) { return { success: true, journey: this.journey.get(id) }; }
  @Post(":id/reserve") reserve(@Param("id") id: string, @Body() body: any) { return { success: true, ...this.journey.reserve(id, body) }; }
  @Post(":id/negotiate") negotiate(@Param("id") id: string, @Body() body: any) { return { success: true, ...this.journey.negotiate(id, body) }; }
  @Post(":id/inspection") inspection(@Param("id") id: string, @Body() body: any) { return { success: true, ...this.journey.bookInspection(id, body) }; }
  @Post(":id/finance") finance(@Param("id") id: string, @Body() body: any) { return { success: true, ...this.journey.submitFinance(id, body) }; }
  @Post(":id/insurance") insurance(@Param("id") id: string, @Body() body: any) { return { success: true, ...this.journey.requestInsurance(id, body) }; }
  @Post(":id/payment") payment(@Param("id") id: string, @Body() body: any) { return { success: true, ...this.journey.pay(id, body) }; }
  @Post(":id/contract") contract(@Param("id") id: string, @Body() body: any) { return { success: true, ...this.journey.createContract(id, body) }; }
  @Post(":id/transfer") transfer(@Param("id") id: string, @Body() body: any) { return { success: true, ...this.journey.transferOwnership(id, body) }; }
  @Post(":id/delivery") delivery(@Param("id") id: string, @Body() body: any) { return { success: true, ...this.journey.scheduleDelivery(id, body) }; }
  @Post("feedback") recordFeedback(@Body() body: any) { return { success: true, feedback: this.feedback.record(body) }; }
  @Get("operations/dashboard") operations() { return { success: true, dashboard: this.dashboard.summary() }; }
  @Get("operations/audit") auditEntries() { return { success: true, entries: this.audit.list() }; }
}

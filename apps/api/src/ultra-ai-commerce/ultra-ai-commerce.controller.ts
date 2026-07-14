import { Body, Controller, Get, Post } from "@nestjs/common";
import { UltraAiCommerceService } from "./ultra-ai-commerce.service";

@Controller("ultra-ai-commerce")
export class UltraAiCommerceController {
  constructor(private readonly ai: UltraAiCommerceService) {}

  @Get("health") health() { return this.ai.health(); }
  @Post("pricing") pricing(@Body() body: any) { return this.ai.pricing.calculate(body); }
  @Post("negotiation") negotiation(@Body() body: any) { return this.ai.negotiation.evaluate(body); }
  @Post("buyer-matching") matching(@Body() body: any) { return this.ai.matching.match(body); }
  @Post("fraud-risk") fraud(@Body() body: any) { return this.ai.fraud.evaluate(body); }
  @Post("market-intelligence") market(@Body() body: any) { return this.ai.market.analyze(body); }
  @Post("seller-assistant") seller(@Body() body: any) { return this.ai.seller.advise(body); }
  @Post("vehicle-health") vehicleHealth(@Body() body: any) { return this.ai.vehicleHealth.calculate(body); }
  @Post("inspection-intelligence") inspection(@Body() body: any) { return this.ai.inspection.summarize(body); }
  @Post("finance-intelligence") finance(@Body() body: any) { return this.ai.finance.evaluate(body); }
  @Post("insurance-intelligence") insurance(@Body() body: any) { return this.ai.insurance.estimate(body); }
  @Post("export-intelligence") exportIntel(@Body() body: any) { return this.ai.exportIntel.evaluate(body); }
  @Post("recommendations") recommendations(@Body() body: any) { return this.ai.recommendations.create(body.items ?? []); }
  @Post("decision") decision(@Body() body: any) { return this.ai.decisions.combine(body.inputs ?? []); }
  @Post("feedback") feedback(@Body() body: any) { return this.ai.feedback.record(body); }
  @Get("feedback/stats") feedbackStats() { return this.ai.feedback.stats(); }
  @Post("batch") batch(@Body() body: any) { return this.ai.batch.execute(body.tasks ?? []); }
  @Post("market-signals") signals(@Body() body: any) { return this.ai.signals.score(body.signals ?? []); }
}

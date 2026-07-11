import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { GrowthEngineService } from "./growth-engine.service";

@Controller("growth-engine")
export class GrowthEngineController {
  constructor(private service: GrowthEngineService) {}

  @Post("opportunities")
  discover(@Body() body: any) {
    return this.service.discoverOpportunity(body);
  }

  @Get("opportunities")
  list() {
    return this.service.listOpportunities();
  }

  @Patch("opportunities/:id/status")
  mark(@Param("id") id: string, @Body() body: any) {
    return this.service.markOpportunity(id, body.status || "reviewed");
  }

  @Post("self-marketing")
  selfMarketing() {
    return this.service.createSelfMarketingOpportunity();
  }
}

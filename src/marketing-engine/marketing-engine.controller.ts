import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { MarketingEngineService } from "./marketing-engine.service";

@Controller("marketing-engine")
export class MarketingEngineController {
  constructor(private service: MarketingEngineService) {}

  @Post("campaigns")
  createCampaign(@Body() body: any) {
    return this.service.createCampaign(body);
  }

  @Get("campaigns")
  listCampaigns() {
    return this.service.listCampaigns();
  }

  @Get("campaigns/:id")
  findCampaign(@Param("id") id: string) {
    return this.service.findCampaign(id);
  }

  @Post("campaigns/:id/generate-ad")
  generateAd(@Param("id") id: string, @Body() body: any) {
    return this.service.generateAd(id, body);
  }

  @Post("campaigns/:id/optimize")
  optimize(@Param("id") id: string, @Body() body: any) {
    return this.service.optimizeCampaign(id, body);
  }

  @Post("campaigns/:id/publishing-plan")
  publishingPlan(@Param("id") id: string, @Body() body: any) {
    return this.service.createPublishingPlan(id, body);
  }
}

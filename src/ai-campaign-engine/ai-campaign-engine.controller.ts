import { Controller, Get, Param, Post } from "@nestjs/common";
import { AiCampaignEngineService } from "./ai-campaign-engine.service";

@Controller("ai-campaign-engine")
export class AiCampaignEngineController {
  constructor(private readonly service: AiCampaignEngineService) {}

  @Post("vehicle/:id/launch")
  launch(@Param("id") id: string) {
    return this.service.launchVehicleCampaign(id);
  }

  @Get("vehicle/:id/launch")
  preview(@Param("id") id: string) {
    return this.service.launchVehicleCampaign(id);
  }
}

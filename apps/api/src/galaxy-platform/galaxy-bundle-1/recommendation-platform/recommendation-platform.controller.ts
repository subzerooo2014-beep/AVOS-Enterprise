import { Body, Controller, Get, Post } from "@nestjs/common";
import { RecommendationPlatformService } from "./recommendation-platform.service";
import { RecommendationPlatformExecutionRequest } from "./recommendation-platform.types";

@Controller("galaxy-platform/recommendation-platform")
export class RecommendationPlatformController {
  constructor(private readonly service: RecommendationPlatformService) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: RecommendationPlatformExecutionRequest) {
    return this.service.execute(request);
  }
}
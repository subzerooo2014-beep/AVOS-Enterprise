import { Body, Controller, Get, Post } from "@nestjs/common";
import { FinancialPlatformService } from "./financial-platform.service";
import { FinancialPlatformExecutionRequest } from "./financial-platform.types";

@Controller("galaxy-platform/financial-platform")
export class FinancialPlatformController {
  constructor(private readonly service: FinancialPlatformService) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: FinancialPlatformExecutionRequest) {
    return this.service.execute(request);
  }
}
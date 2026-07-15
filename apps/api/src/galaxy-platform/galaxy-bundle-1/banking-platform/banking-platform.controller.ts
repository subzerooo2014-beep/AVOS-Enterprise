import { Body, Controller, Get, Post } from "@nestjs/common";
import { BankingPlatformService } from "./banking-platform.service";
import { BankingPlatformExecutionRequest } from "./banking-platform.types";

@Controller("galaxy-platform/banking-platform")
export class BankingPlatformController {
  constructor(private readonly service: BankingPlatformService) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: BankingPlatformExecutionRequest) {
    return this.service.execute(request);
  }
}
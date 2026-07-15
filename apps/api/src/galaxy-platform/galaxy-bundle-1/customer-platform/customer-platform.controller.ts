import { Body, Controller, Get, Post } from "@nestjs/common";
import { CustomerPlatformService } from "./customer-platform.service";
import { CustomerPlatformExecutionRequest } from "./customer-platform.types";

@Controller("galaxy-platform/customer-platform")
export class CustomerPlatformController {
  constructor(private readonly service: CustomerPlatformService) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: CustomerPlatformExecutionRequest) {
    return this.service.execute(request);
  }
}
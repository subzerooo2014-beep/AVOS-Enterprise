import { Body, Controller, Get, Post } from "@nestjs/common";
import { Galaxy2Domain062Service } from "./galaxy-2-domain-062.service";
import { Galaxy2Domain062ExecutionRequest } from "./galaxy-2-domain-062.types";

@Controller("galaxy-platform/bundle-2/galaxy-2-domain-062")
export class Galaxy2Domain062Controller {
  constructor(private readonly service: Galaxy2Domain062Service) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: Galaxy2Domain062ExecutionRequest) {
    return this.service.execute(request);
  }
}
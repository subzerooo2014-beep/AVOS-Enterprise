import { Body, Controller, Get, Post } from "@nestjs/common";
import { Galaxy2Domain005Service } from "./galaxy-2-domain-005.service";
import { Galaxy2Domain005ExecutionRequest } from "./galaxy-2-domain-005.types";

@Controller("galaxy-platform/bundle-2/galaxy-2-domain-005")
export class Galaxy2Domain005Controller {
  constructor(private readonly service: Galaxy2Domain005Service) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: Galaxy2Domain005ExecutionRequest) {
    return this.service.execute(request);
  }
}
import { Body, Controller, Get, Post } from "@nestjs/common";
import { Galaxy2Domain013Service } from "./galaxy-2-domain-013.service";
import { Galaxy2Domain013ExecutionRequest } from "./galaxy-2-domain-013.types";

@Controller("galaxy-platform/bundle-2/galaxy-2-domain-013")
export class Galaxy2Domain013Controller {
  constructor(private readonly service: Galaxy2Domain013Service) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: Galaxy2Domain013ExecutionRequest) {
    return this.service.execute(request);
  }
}
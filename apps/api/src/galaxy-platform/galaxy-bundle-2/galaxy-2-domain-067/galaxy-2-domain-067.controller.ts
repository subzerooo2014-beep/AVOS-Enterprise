import { Body, Controller, Get, Post } from "@nestjs/common";
import { Galaxy2Domain067Service } from "./galaxy-2-domain-067.service";
import { Galaxy2Domain067ExecutionRequest } from "./galaxy-2-domain-067.types";

@Controller("galaxy-platform/bundle-2/galaxy-2-domain-067")
export class Galaxy2Domain067Controller {
  constructor(private readonly service: Galaxy2Domain067Service) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: Galaxy2Domain067ExecutionRequest) {
    return this.service.execute(request);
  }
}
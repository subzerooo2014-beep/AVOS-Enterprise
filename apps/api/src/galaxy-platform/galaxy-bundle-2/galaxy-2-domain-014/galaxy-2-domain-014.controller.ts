import { Body, Controller, Get, Post } from "@nestjs/common";
import { Galaxy2Domain014Service } from "./galaxy-2-domain-014.service";
import { Galaxy2Domain014ExecutionRequest } from "./galaxy-2-domain-014.types";

@Controller("galaxy-platform/bundle-2/galaxy-2-domain-014")
export class Galaxy2Domain014Controller {
  constructor(private readonly service: Galaxy2Domain014Service) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: Galaxy2Domain014ExecutionRequest) {
    return this.service.execute(request);
  }
}
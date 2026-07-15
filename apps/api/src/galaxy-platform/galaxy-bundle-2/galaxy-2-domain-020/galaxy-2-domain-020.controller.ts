import { Body, Controller, Get, Post } from "@nestjs/common";
import { Galaxy2Domain020Service } from "./galaxy-2-domain-020.service";
import { Galaxy2Domain020ExecutionRequest } from "./galaxy-2-domain-020.types";

@Controller("galaxy-platform/bundle-2/galaxy-2-domain-020")
export class Galaxy2Domain020Controller {
  constructor(private readonly service: Galaxy2Domain020Service) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: Galaxy2Domain020ExecutionRequest) {
    return this.service.execute(request);
  }
}
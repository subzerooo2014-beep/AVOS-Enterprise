import { Body, Controller, Get, Post } from "@nestjs/common";
import { Galaxy2Domain060Service } from "./galaxy-2-domain-060.service";
import { Galaxy2Domain060ExecutionRequest } from "./galaxy-2-domain-060.types";

@Controller("galaxy-platform/bundle-2/galaxy-2-domain-060")
export class Galaxy2Domain060Controller {
  constructor(private readonly service: Galaxy2Domain060Service) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: Galaxy2Domain060ExecutionRequest) {
    return this.service.execute(request);
  }
}
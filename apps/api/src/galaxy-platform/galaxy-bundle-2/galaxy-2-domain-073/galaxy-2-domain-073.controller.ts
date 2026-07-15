import { Body, Controller, Get, Post } from "@nestjs/common";
import { Galaxy2Domain073Service } from "./galaxy-2-domain-073.service";
import { Galaxy2Domain073ExecutionRequest } from "./galaxy-2-domain-073.types";

@Controller("galaxy-platform/bundle-2/galaxy-2-domain-073")
export class Galaxy2Domain073Controller {
  constructor(private readonly service: Galaxy2Domain073Service) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: Galaxy2Domain073ExecutionRequest) {
    return this.service.execute(request);
  }
}
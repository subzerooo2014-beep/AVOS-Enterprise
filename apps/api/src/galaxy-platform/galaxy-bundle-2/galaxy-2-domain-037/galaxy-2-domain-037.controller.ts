import { Body, Controller, Get, Post } from "@nestjs/common";
import { Galaxy2Domain037Service } from "./galaxy-2-domain-037.service";
import { Galaxy2Domain037ExecutionRequest } from "./galaxy-2-domain-037.types";

@Controller("galaxy-platform/bundle-2/galaxy-2-domain-037")
export class Galaxy2Domain037Controller {
  constructor(private readonly service: Galaxy2Domain037Service) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: Galaxy2Domain037ExecutionRequest) {
    return this.service.execute(request);
  }
}
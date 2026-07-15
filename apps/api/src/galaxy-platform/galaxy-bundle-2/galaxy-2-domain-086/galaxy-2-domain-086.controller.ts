import { Body, Controller, Get, Post } from "@nestjs/common";
import { Galaxy2Domain086Service } from "./galaxy-2-domain-086.service";
import { Galaxy2Domain086ExecutionRequest } from "./galaxy-2-domain-086.types";

@Controller("galaxy-platform/bundle-2/galaxy-2-domain-086")
export class Galaxy2Domain086Controller {
  constructor(private readonly service: Galaxy2Domain086Service) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: Galaxy2Domain086ExecutionRequest) {
    return this.service.execute(request);
  }
}
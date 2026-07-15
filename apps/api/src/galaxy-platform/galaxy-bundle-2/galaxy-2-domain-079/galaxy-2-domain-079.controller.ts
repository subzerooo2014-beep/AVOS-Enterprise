import { Body, Controller, Get, Post } from "@nestjs/common";
import { Galaxy2Domain079Service } from "./galaxy-2-domain-079.service";
import { Galaxy2Domain079ExecutionRequest } from "./galaxy-2-domain-079.types";

@Controller("galaxy-platform/bundle-2/galaxy-2-domain-079")
export class Galaxy2Domain079Controller {
  constructor(private readonly service: Galaxy2Domain079Service) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: Galaxy2Domain079ExecutionRequest) {
    return this.service.execute(request);
  }
}
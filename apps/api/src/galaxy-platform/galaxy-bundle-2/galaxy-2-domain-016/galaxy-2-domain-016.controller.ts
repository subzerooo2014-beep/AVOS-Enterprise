import { Body, Controller, Get, Post } from "@nestjs/common";
import { Galaxy2Domain016Service } from "./galaxy-2-domain-016.service";
import { Galaxy2Domain016ExecutionRequest } from "./galaxy-2-domain-016.types";

@Controller("galaxy-platform/bundle-2/galaxy-2-domain-016")
export class Galaxy2Domain016Controller {
  constructor(private readonly service: Galaxy2Domain016Service) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: Galaxy2Domain016ExecutionRequest) {
    return this.service.execute(request);
  }
}
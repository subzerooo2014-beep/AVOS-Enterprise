import { Body, Controller, Get, Post } from "@nestjs/common";
import { Galaxy2Domain058Service } from "./galaxy-2-domain-058.service";
import { Galaxy2Domain058ExecutionRequest } from "./galaxy-2-domain-058.types";

@Controller("galaxy-platform/bundle-2/galaxy-2-domain-058")
export class Galaxy2Domain058Controller {
  constructor(private readonly service: Galaxy2Domain058Service) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: Galaxy2Domain058ExecutionRequest) {
    return this.service.execute(request);
  }
}
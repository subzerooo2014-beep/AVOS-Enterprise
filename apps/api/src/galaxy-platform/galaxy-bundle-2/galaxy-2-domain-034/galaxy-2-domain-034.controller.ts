import { Body, Controller, Get, Post } from "@nestjs/common";
import { Galaxy2Domain034Service } from "./galaxy-2-domain-034.service";
import { Galaxy2Domain034ExecutionRequest } from "./galaxy-2-domain-034.types";

@Controller("galaxy-platform/bundle-2/galaxy-2-domain-034")
export class Galaxy2Domain034Controller {
  constructor(private readonly service: Galaxy2Domain034Service) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: Galaxy2Domain034ExecutionRequest) {
    return this.service.execute(request);
  }
}
import { Body, Controller, Get, Post } from "@nestjs/common";
import { Galaxy2Domain055Service } from "./galaxy-2-domain-055.service";
import { Galaxy2Domain055ExecutionRequest } from "./galaxy-2-domain-055.types";

@Controller("galaxy-platform/bundle-2/galaxy-2-domain-055")
export class Galaxy2Domain055Controller {
  constructor(private readonly service: Galaxy2Domain055Service) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: Galaxy2Domain055ExecutionRequest) {
    return this.service.execute(request);
  }
}
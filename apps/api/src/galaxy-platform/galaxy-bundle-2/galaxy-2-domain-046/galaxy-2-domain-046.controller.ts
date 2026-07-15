import { Body, Controller, Get, Post } from "@nestjs/common";
import { Galaxy2Domain046Service } from "./galaxy-2-domain-046.service";
import { Galaxy2Domain046ExecutionRequest } from "./galaxy-2-domain-046.types";

@Controller("galaxy-platform/bundle-2/galaxy-2-domain-046")
export class Galaxy2Domain046Controller {
  constructor(private readonly service: Galaxy2Domain046Service) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: Galaxy2Domain046ExecutionRequest) {
    return this.service.execute(request);
  }
}
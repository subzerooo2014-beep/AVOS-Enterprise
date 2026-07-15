import { Body, Controller, Get, Post } from "@nestjs/common";
import { Galaxy2Domain076Service } from "./galaxy-2-domain-076.service";
import { Galaxy2Domain076ExecutionRequest } from "./galaxy-2-domain-076.types";

@Controller("galaxy-platform/bundle-2/galaxy-2-domain-076")
export class Galaxy2Domain076Controller {
  constructor(private readonly service: Galaxy2Domain076Service) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: Galaxy2Domain076ExecutionRequest) {
    return this.service.execute(request);
  }
}
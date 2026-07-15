import { Body, Controller, Get, Post } from "@nestjs/common";
import { Galaxy2Domain017Service } from "./galaxy-2-domain-017.service";
import { Galaxy2Domain017ExecutionRequest } from "./galaxy-2-domain-017.types";

@Controller("galaxy-platform/bundle-2/galaxy-2-domain-017")
export class Galaxy2Domain017Controller {
  constructor(private readonly service: Galaxy2Domain017Service) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: Galaxy2Domain017ExecutionRequest) {
    return this.service.execute(request);
  }
}
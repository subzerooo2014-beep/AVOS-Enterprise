import { Body, Controller, Get, Post } from "@nestjs/common";

import { EnterpriseRuntimeService } from "./enterprise-runtime.service";

@Controller("enterprise-runtime")
export class EnterpriseRuntimeController {
  constructor(
    private readonly runtimeService: EnterpriseRuntimeService,
  ) {}

  @Get("status")
  status() {
    return this.runtimeService.status();
  }

  @Get("health")
  health() {
    return this.runtimeService.health();
  }

  @Get("cluster")
  cluster() {
    return this.runtimeService.cluster();
  }

  @Post("coordinate")
  coordinate() {
    return this.runtimeService.coordinate();
  }

  @Post("schedule")
  schedule(@Body() body: Record<string, any>) {
    return this.runtimeService.schedule(body);
  }
}

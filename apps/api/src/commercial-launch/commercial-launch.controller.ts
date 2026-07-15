import { Body, Controller, Get, Post } from "@nestjs/common";
import { CommercialLaunchService } from "./commercial-launch.service";
import { CommercialLaunchExecutionRequest } from "./commercial-launch.types";

@Controller("commercial-launch")
export class CommercialLaunchController {
  constructor(private readonly launch: CommercialLaunchService) {}

  @Get("capabilities")
  capabilities() {
    return this.launch.capabilities();
  }

  @Post("execute")
  execute(@Body() request: CommercialLaunchExecutionRequest) {
    return this.launch.execute(request);
  }

  @Get("dashboard")
  dashboard() {
    return this.launch.dashboard();
  }
}
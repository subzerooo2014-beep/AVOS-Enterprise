import { Body, Controller, Get, Post } from "@nestjs/common";
import { SearchPlatformService } from "./search-platform.service";
import { SearchPlatformExecutionRequest } from "./search-platform.types";

@Controller("galaxy-platform/search-platform")
export class SearchPlatformController {
  constructor(private readonly service: SearchPlatformService) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: SearchPlatformExecutionRequest) {
    return this.service.execute(request);
  }
}
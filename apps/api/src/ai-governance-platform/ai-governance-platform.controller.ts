import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { AiGovernancePlatformService } from "./ai-governance-platform.service";
import { AiGovernancePlatformCapability } from "./ai-governance-platform.types";

@Controller("ai-governance-platform")
export class AiGovernancePlatformController {
  constructor(private readonly service: AiGovernancePlatformService) {}

  @Get("status")
  status() {
    return this.service.status();
  }

  @Get("records")
  list() {
    return this.service.list();
  }

  @Post("execute/:capability")
  execute(
    @Param("capability") capability: AiGovernancePlatformCapability,
    @Body() metadata: Record<string, unknown>,
  ) {
    return this.service.execute(capability, metadata);
  }
}
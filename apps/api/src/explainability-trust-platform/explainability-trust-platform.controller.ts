import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ExplainabilityTrustPlatformService } from "./explainability-trust-platform.service";
import { ExplainabilityTrustPlatformCapability } from "./explainability-trust-platform.types";

@Controller("explainability-trust-platform")
export class ExplainabilityTrustPlatformController {
  constructor(private readonly service: ExplainabilityTrustPlatformService) {}

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
    @Param("capability") capability: ExplainabilityTrustPlatformCapability,
    @Body() metadata: Record<string, unknown>,
  ) {
    return this.service.execute(capability, metadata);
  }
}
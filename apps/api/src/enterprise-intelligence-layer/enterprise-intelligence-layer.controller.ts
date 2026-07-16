import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { EnterpriseIntelligenceLayerService } from "./enterprise-intelligence-layer.service";
import { EnterpriseIntelligenceLayerCapability } from "./enterprise-intelligence-layer.types";

@Controller("enterprise-intelligence-layer")
export class EnterpriseIntelligenceLayerController {
  constructor(private readonly service: EnterpriseIntelligenceLayerService) {}

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
    @Param("capability") capability: EnterpriseIntelligenceLayerCapability,
    @Body() metadata: Record<string, unknown>,
  ) {
    return this.service.execute(capability, metadata);
  }
}
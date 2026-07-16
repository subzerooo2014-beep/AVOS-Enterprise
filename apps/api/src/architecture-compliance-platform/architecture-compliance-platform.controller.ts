import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ArchitectureCompliancePlatformService } from "./architecture-compliance-platform.service";
import { ArchitectureCompliancePlatformCapability } from "./architecture-compliance-platform.types";

@Controller("architecture-compliance-platform")
export class ArchitectureCompliancePlatformController {
  constructor(private readonly service: ArchitectureCompliancePlatformService) {}

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
    @Param("capability") capability: ArchitectureCompliancePlatformCapability,
    @Body() metadata: Record<string, unknown>,
  ) {
    return this.service.execute(capability, metadata);
  }
}
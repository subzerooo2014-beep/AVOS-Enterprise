import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { FoundationGovernanceConformanceService } from "./foundation-governance-conformance.service";
import { FoundationGovernanceConformanceCapability } from "./foundation-governance-conformance.types";

@Controller("foundation-governance-conformance")
export class FoundationGovernanceConformanceController {
  constructor(private readonly service: FoundationGovernanceConformanceService) {}

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
    @Param("capability") capability: FoundationGovernanceConformanceCapability,
    @Body() metadata: Record<string, unknown>,
  ) {
    return this.service.execute(capability, metadata);
  }
}
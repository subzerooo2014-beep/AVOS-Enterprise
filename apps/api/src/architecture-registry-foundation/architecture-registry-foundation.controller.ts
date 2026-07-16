import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ArchitectureRegistryFoundationService } from "./architecture-registry-foundation.service";
import { ArchitectureRegistryFoundationCapability } from "./architecture-registry-foundation.types";

@Controller("architecture-registry-foundation")
export class ArchitectureRegistryFoundationController {
  constructor(private readonly service: ArchitectureRegistryFoundationService) {}

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
    @Param("capability") capability: ArchitectureRegistryFoundationCapability,
    @Body() metadata: Record<string, unknown>,
  ) {
    return this.service.execute(capability, metadata);
  }
}
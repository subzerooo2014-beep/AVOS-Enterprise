import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { UniversalDataFabricService } from "./universal-data-fabric.service";
import { UniversalDataFabricCapability } from "./universal-data-fabric.types";

@Controller("universal-data-fabric")
export class UniversalDataFabricController {
  constructor(private readonly service: UniversalDataFabricService) {}

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
    @Param("capability") capability: UniversalDataFabricCapability,
    @Body() metadata: Record<string, unknown>,
  ) {
    return this.service.execute(capability, metadata);
  }
}
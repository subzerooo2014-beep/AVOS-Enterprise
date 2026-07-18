import { Body, Controller, Get, Post } from "@nestjs/common";
import { FactoryRuntimeSmokeCapabilityService } from "./factory-runtime-smoke-capability.service";
import { CreateFactoryRuntimeSmokeCapabilityDto } from "./dto/create-factory-runtime-smoke-capability.dto";

@Controller("factory-runtime-smoke-capability")
export class FactoryRuntimeSmokeCapabilityController {
  constructor(private readonly service: FactoryRuntimeSmokeCapabilityService) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Post()
  execute(@Body() dto: CreateFactoryRuntimeSmokeCapabilityDto) {
    return this.service.execute(dto);
  }
}
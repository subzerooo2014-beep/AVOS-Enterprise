import { Body, Controller, Get, Post } from "@nestjs/common";
import { FactoryGeneratedCapabilityService } from "./factory-generated-capability.service";
import { CreateFactoryGeneratedCapabilityDto } from "./dto/create-factory-generated-capability.dto";

@Controller("factory-generated-capability")
export class FactoryGeneratedCapabilityController {
  constructor(private readonly service: FactoryGeneratedCapabilityService) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Post()
  execute(@Body() dto: CreateFactoryGeneratedCapabilityDto) {
    return this.service.execute(dto);
  }
}
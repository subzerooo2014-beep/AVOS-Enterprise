import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ArchitectureBlueprintInput } from "./architecture-engine.contracts";
import { FactoryArchitectureEngineService } from "./factory-architecture-engine.service";

@Controller("avos/factory/architecture")
export class FactoryArchitectureEngineController {
  constructor(private readonly engine: FactoryArchitectureEngineService) {}

  @Get("status")
  getStatus() {
    return this.engine.getStatus();
  }

  @Get("architectures")
  listArchitectures() {
    return this.engine.list();
  }

  @Get("architectures/:id")
  getArchitecture(@Param("id") id: string) {
    return this.engine.getById(id);
  }

  @Post("design")
  design(@Body() input: ArchitectureBlueprintInput) {
    return this.engine.design(input);
  }

  @Post("architectures/:id/certify")
  certify(
    @Param("id") id: string,
    @Body() body: { approvedBy: string }
  ) {
    return this.engine.certify(id, body.approvedBy);
  }

  @Post("smoke")
  smoke() {
    return this.engine.runSmoke();
  }
}

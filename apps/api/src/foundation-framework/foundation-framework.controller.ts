import { Controller, Get, NotFoundException, Param, Post } from "@nestjs/common";
import { FoundationFrameworkService } from "./foundation-framework.service";

@Controller("foundation-framework")
export class FoundationFrameworkController {
  constructor(
    private readonly foundationFrameworkService: FoundationFrameworkService,
  ) {}

  @Get("status")
  status() {
    return this.foundationFrameworkService.status();
  }

  @Get("capabilities")
  capabilities() {
    return {
      success: true,
      items: this.foundationFrameworkService.listCapabilities(),
    };
  }

  @Get("capabilities/:id")
  capability(@Param("id") id: string) {
    const capability = this.foundationFrameworkService.getCapability(id);
    if (!capability) {
      throw new NotFoundException(`Foundation capability '${id}' was not found.`);
    }

    return { success: true, capability };
  }

  @Get("dependencies")
  dependencies() {
    return {
      success: true,
      items: this.foundationFrameworkService.listDependencies(),
    };
  }

  @Get("contracts")
  contracts() {
    return {
      success: true,
      items: this.foundationFrameworkService.listContracts(),
    };
  }

  @Get("policies")
  policies() {
    return {
      success: true,
      items: this.foundationFrameworkService.listPolicies(),
    };
  }

  @Get("schemas")
  schemas() {
    return {
      success: true,
      items: this.foundationFrameworkService.listSchemas(),
    };
  }

  @Post("validate")
  validate() {
    const compliance = this.foundationFrameworkService.validate();
    return {
      success: compliance.compliant,
      system: "AVOS Foundation Framework",
      compliance,
    };
  }
}

import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { IndustryPlatformService } from "./industry-platform.service";
import {
  IndustryDefinition,
  IndustryOperationRequest,
  SharedCapabilityDefinition,
} from "./industry-platform.types";

@Controller("industry-platform")
export class IndustryPlatformController {
  constructor(private readonly platform: IndustryPlatformService) {}

  @Get("industries")
  listIndustries() {
    return this.platform.listIndustries();
  }

  @Get("industries/:key")
  industry(@Param("key") key: string) {
    return this.platform.industry(key);
  }

  @Post("industries")
  registerIndustry(
    @Body()
    input: Omit<IndustryDefinition, "createdAt" | "updatedAt">,
  ) {
    return this.platform.registerIndustry(input);
  }

  @Get("capabilities")
  listCapabilities() {
    return this.platform.listCapabilities();
  }

  @Post("capabilities")
  registerCapability(
    @Body()
    input: Omit<SharedCapabilityDefinition, "createdAt" | "updatedAt">,
  ) {
    return this.platform.registerCapability(input);
  }

  @Post("industries/:industryKey/capabilities/:capabilityKey")
  bindCapability(
    @Param("industryKey") industryKey: string,
    @Param("capabilityKey") capabilityKey: string,
    @Body() body: { configuration: Record<string, unknown> },
  ) {
    return this.platform.bindCapability(
      industryKey,
      capabilityKey,
      body.configuration,
    );
  }

  @Get("industries/:industryKey/bindings")
  bindingsForIndustry(@Param("industryKey") industryKey: string) {
    return this.platform.bindingsForIndustry(industryKey);
  }

  @Post("execute")
  execute(@Body() request: IndustryOperationRequest) {
    return this.platform.execute(request);
  }

  @Get("dashboard")
  dashboard() {
    return this.platform.dashboard();
  }
}
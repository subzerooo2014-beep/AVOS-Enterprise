import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { FoundationCoreService } from "./foundation-core.service";
import {
  CapabilityRegistryEntry,
  FoundationAuditRecord,
  FoundationDecisionRequest,
  FoundationEventRecord,
  IndustryRegistryEntry,
  LeadDealRecord,
  PlatformRegistryEntry,
} from "./foundation-core.types";

@Controller("foundation-core")
export class FoundationCoreController {
  constructor(private readonly foundation: FoundationCoreService) {}

  @Get("components")
  components() {
    return this.foundation.components();
  }

  @Post("platforms")
  registerPlatform(
    @Body()
    input: Omit<PlatformRegistryEntry, "createdAt" | "updatedAt">,
  ) {
    return this.foundation.registerPlatform(input);
  }

  @Post("industries")
  registerIndustry(
    @Body()
    input: Omit<IndustryRegistryEntry, "createdAt" | "updatedAt">,
  ) {
    return this.foundation.registerIndustry(input);
  }

  @Post("capabilities")
  registerCapability(
    @Body()
    input: Omit<CapabilityRegistryEntry, "createdAt" | "updatedAt">,
  ) {
    return this.foundation.registerCapability(input);
  }

  @Post("lead-deals")
  createLeadDeal(
    @Body()
    input: Omit<LeadDealRecord, "id" | "createdAt" | "updatedAt">,
  ) {
    return this.foundation.createLeadDeal(input);
  }

  @Patch("lead-deals/:id/stage")
  advanceLeadDeal(
    @Param("id") id: string,
    @Body() body: { stage: LeadDealRecord["stage"] },
  ) {
    return this.foundation.advanceLeadDeal(id, body.stage);
  }

  @Post("audit")
  trackAudit(
    @Body()
    input: Omit<FoundationAuditRecord, "id" | "createdAt">,
  ) {
    return this.foundation.trackAudit(input);
  }

  @Post("events")
  trackEvent(
    @Body()
    input: Omit<FoundationEventRecord, "id" | "createdAt">,
  ) {
    return this.foundation.trackEvent(input);
  }

  @Post("owner-ai/decision")
  ownerDecision(@Body() input: FoundationDecisionRequest) {
    return this.foundation.ownerDecision(input);
  }

  @Get("dashboard")
  dashboard() {
    return this.foundation.dashboard();
  }
}
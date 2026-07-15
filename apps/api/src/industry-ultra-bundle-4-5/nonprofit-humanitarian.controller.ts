import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { IndustryUltraBundle45Service } from "./industry-ultra-bundle-4-5.service";
import {
  SpecializedCapability,
  SpecializedIndustryInsight,
  SpecializedIndustryMission,
  SpecializedIndustryRecord,
} from "./industry-ultra-bundle-4-5.types";

@Controller("nonprofit-humanitarian-industry")
export class NonprofitHumanitarianIndustryController {
  constructor(private readonly industry: IndustryUltraBundle45Service) {}

  @Get()
  framework() {
    return this.industry.framework();
  }

  @Post(":capability/records")
  createRecord(
    @Param("capability") capability: SpecializedCapability,
    @Body()
    input: Omit<
      SpecializedIndustryRecord,
      "id" | "industry" | "capability" | "status" | "createdAt" | "updatedAt"
    >,
  ) {
    return this.industry.createRecord("NONPROFIT_HUMANITARIAN", capability, input);
  }

  @Get("records")
  listRecords(
    @Query("capability") capability?: SpecializedCapability,
    @Query("tenantId") tenantId?: string,
  ) {
    return this.industry.listRecords("NONPROFIT_HUMANITARIAN", capability, tenantId);
  }

  @Patch("records/:id/activate")
  activateRecord(@Param("id") id: string) {
    return this.industry.activateRecord(id);
  }

  @Post("records/:id/missions")
  createMission(
    @Param("id") id: string,
    @Body()
    input: Omit<
      SpecializedIndustryMission,
      "id" | "recordId" | "status" | "createdAt" | "updatedAt"
    >,
  ) {
    return this.industry.createMission(id, input);
  }

  @Post("missions/:id/start")
  startMission(@Param("id") id: string) {
    return this.industry.startMission(id);
  }

  @Post("missions/:id/complete")
  completeMission(
    @Param("id") id: string,
    @Body() body: { evidence: string },
  ) {
    return this.industry.completeMission(id, body.evidence);
  }

  @Post("records/:id/insights")
  createInsight(
    @Param("id") id: string,
    @Body()
    input: Omit<
      SpecializedIndustryInsight,
      "id" | "recordId" | "createdAt"
    >,
  ) {
    return this.industry.createInsight(id, input);
  }

  @Get("command-center")
  commandCenter() {
    return this.industry.commandCenter("NONPROFIT_HUMANITARIAN");
  }
}
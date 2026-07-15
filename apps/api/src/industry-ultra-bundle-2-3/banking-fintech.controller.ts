import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { IndustryUltraBundle23Service } from "./industry-ultra-bundle-2-3.service";
import {
  UltraIndustryCapability,
  UltraIndustryInsight,
  UltraIndustryRecord,
  UltraIndustryWorkflow,
} from "./industry-ultra-bundle-2-3.types";

@Controller("banking-fintech-industry")
export class BankingFintechIndustryController {
  constructor(private readonly industry: IndustryUltraBundle23Service) {}

  @Get()
  framework() {
    return this.industry.framework();
  }

  @Post(":capability/records")
  createRecord(
    @Param("capability") capability: UltraIndustryCapability,
    @Body()
    input: Omit<
      UltraIndustryRecord,
      "id" | "industry" | "capability" | "status" | "createdAt" | "updatedAt"
    >,
  ) {
    return this.industry.createRecord("BANKING_FINTECH", capability, input);
  }

  @Get("records")
  listRecords(
    @Query("capability") capability?: UltraIndustryCapability,
    @Query("tenantId") tenantId?: string,
  ) {
    return this.industry.listRecords("BANKING_FINTECH", capability, tenantId);
  }

  @Patch("records/:id/activate")
  activateRecord(@Param("id") id: string) {
    return this.industry.activateRecord(id);
  }

  @Post("records/:id/workflows")
  createWorkflow(
    @Param("id") id: string,
    @Body()
    input: Omit<
      UltraIndustryWorkflow,
      "id" | "recordId" | "status" | "createdAt" | "updatedAt"
    >,
  ) {
    return this.industry.createWorkflow(id, input);
  }

  @Post("workflows/:id/start")
  startWorkflow(@Param("id") id: string) {
    return this.industry.startWorkflow(id);
  }

  @Post("workflows/:id/complete")
  completeWorkflow(
    @Param("id") id: string,
    @Body() body: { evidence: string },
  ) {
    return this.industry.completeWorkflow(id, body.evidence);
  }

  @Post("records/:id/insights")
  createInsight(
    @Param("id") id: string,
    @Body()
    input: Omit<UltraIndustryInsight, "id" | "recordId" | "createdAt">,
  ) {
    return this.industry.createInsight(id, input);
  }

  @Get("command-center")
  commandCenter() {
    return this.industry.commandCenter("BANKING_FINTECH");
  }
}
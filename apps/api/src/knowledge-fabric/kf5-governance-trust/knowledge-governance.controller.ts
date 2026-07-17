import { Body, Controller, Get, Post } from "@nestjs/common";
import { KnowledgeGovernanceService } from "./knowledge-governance.service";
import { KnowledgeApprovalInput, KnowledgeTrustAssessmentInput } from "./knowledge-governance.types";

@Controller("avos/knowledge-fabric/kf5")
export class KnowledgeGovernanceController {
  constructor(private readonly service: KnowledgeGovernanceService) {}

  @Post("bootstrap") bootstrap() { return this.service.bootstrap(); }
  @Post("assess") assess(@Body() input: KnowledgeTrustAssessmentInput) { return this.service.assess(input); }
  @Post("approve") approve(@Body() input: KnowledgeApprovalInput) { return this.service.approve(input); }
  @Get("policies") policies() { return this.service.policies(); }
  @Get("assessments") assessments() { return this.service.assessments(); }
  @Get("approvals") approvals() { return this.service.approvals(); }
  @Get("audit") audit() { return this.service.auditLog(); }
  @Get("status") status() { return this.service.status(); }
  @Get("health") health() { return this.service.health(); }
  @Get("verification") verification() { return this.service.verification(); }
  @Get("smoke") smoke() { return this.service.smoke(); }
}
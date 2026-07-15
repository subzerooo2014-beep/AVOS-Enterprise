import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { IndustryGovernancePartnersService } from "./industry-governance-partners.service";
import {
  ApprovalRequest,
  ComplianceCheck,
  GovernanceAuditRecord,
  PartnerAgreement,
  PartnerProfile,
  PartnerSettlement,
  PermissionPolicy,
  SlaRecord,
} from "./industry-governance-partners.types";

@Controller("industry-governance-partners")
export class IndustryGovernancePartnersController {
  constructor(
    private readonly governance: IndustryGovernancePartnersService,
  ) {}

  @Get("components")
  components() {
    return this.governance.components();
  }

  @Post("partners")
  createPartner(
    @Body()
    input: Omit<PartnerProfile, "id" | "status" | "createdAt" | "updatedAt">,
  ) {
    return this.governance.createPartner(input);
  }

  @Patch("partners/:id/verify")
  verifyPartner(
    @Param("id") id: string,
    @Body() body: { verificationScore: number },
  ) {
    return this.governance.verifyPartner(id, body.verificationScore);
  }

  @Patch("partners/:id/activate")
  activatePartner(@Param("id") id: string) {
    return this.governance.activatePartner(id);
  }

  @Post("permissions")
  createPermissionPolicy(
    @Body()
    input: Omit<PermissionPolicy, "id" | "createdAt" | "updatedAt">,
  ) {
    return this.governance.createPermissionPolicy(input);
  }

  @Post("permissions/evaluate")
  evaluatePermission(
    @Body()
    body: {
      tenantId: string;
      role: string;
      resource: string;
      action: string;
    },
  ) {
    return this.governance.evaluatePermission(
      body.tenantId,
      body.role,
      body.resource,
      body.action,
    );
  }

  @Post("approvals")
  createApproval(
    @Body()
    input: Omit<ApprovalRequest, "id" | "status" | "createdAt" | "updatedAt">,
  ) {
    return this.governance.createApproval(input);
  }

  @Patch("approvals/:id/decision")
  decideApproval(
    @Param("id") id: string,
    @Body()
    body: {
      decision: "APPROVED" | "REJECTED";
      reason?: string;
    },
  ) {
    return this.governance.decideApproval(
      id,
      body.decision,
      body.reason,
    );
  }

  @Post("compliance/checks")
  runComplianceCheck(
    @Body()
    input: Omit<ComplianceCheck, "id" | "status" | "createdAt"> & {
      passed: boolean;
      reviewRequired?: boolean;
    },
  ) {
    return this.governance.runComplianceCheck(input);
  }

  @Post("risk/assessments")
  assessRisk(
    @Body()
    body: {
      tenantId: string;
      industryKey: string;
      subjectType: string;
      subjectId: string;
      signals: Record<string, number>;
    },
  ) {
    return this.governance.assessRisk(
      body.tenantId,
      body.industryKey,
      body.subjectType,
      body.subjectId,
      body.signals,
    );
  }

  @Post("agreements")
  createAgreement(
    @Body()
    input: Omit<PartnerAgreement, "id" | "status" | "createdAt" | "updatedAt">,
  ) {
    return this.governance.createAgreement(input);
  }

  @Patch("agreements/:id/activate")
  activateAgreement(@Param("id") id: string) {
    return this.governance.activateAgreement(id);
  }

  @Post("slas")
  createSla(
    @Body()
    input: Omit<SlaRecord, "id" | "breachCount" | "createdAt" | "updatedAt">,
  ) {
    return this.governance.createSla(input);
  }

  @Patch("slas/:id/breach")
  recordSlaBreach(@Param("id") id: string) {
    return this.governance.recordSlaBreach(id);
  }

  @Post("settlements")
  createSettlement(
    @Body()
    input: Omit<
      PartnerSettlement,
      "id" | "netAmount" | "status" | "createdAt" | "updatedAt"
    >,
  ) {
    return this.governance.createSettlement(input);
  }

  @Patch("settlements/:id/approve")
  approveSettlement(@Param("id") id: string) {
    return this.governance.approveSettlement(id);
  }

  @Post("audit")
  trackAudit(
    @Body()
    input: Omit<GovernanceAuditRecord, "id" | "createdAt">,
  ) {
    return this.governance.trackAudit(input);
  }

  @Get("dashboard")
  dashboard() {
    return this.governance.dashboard();
  }
}
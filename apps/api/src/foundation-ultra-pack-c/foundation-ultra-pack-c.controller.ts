import { Body, Controller, Get, Post } from "@nestjs/common";
import { GovernancePolicyRuntimeService } from "./governance-policy-runtime.service";
import { SecurityFoundationService } from "./security-foundation.service";
import { PrivacyComplianceRuntimeService } from "./privacy-compliance-runtime.service";
import { FoundationUltraPackCStatusService } from "./foundation-ultra-pack-c-status.service";
import { FoundationUltraPackCAssuranceService } from "./foundation-ultra-pack-c-assurance.service";

@Controller("avos/foundation/ultra-pack-c")
export class FoundationUltraPackCController {
  constructor(
    private readonly governance: GovernancePolicyRuntimeService,
    private readonly security: SecurityFoundationService,
    private readonly privacy: PrivacyComplianceRuntimeService,
    private readonly statusService: FoundationUltraPackCStatusService,
    private readonly assurance: FoundationUltraPackCAssuranceService,
  ) {}

  @Get("status")
  status() {
    return this.statusService.status();
  }

  @Get("governance/policies")
  policies() {
    return this.governance.listPolicies();
  }

  @Get("governance/evaluations")
  policyEvaluations() {
    return this.governance.listEvaluations();
  }

  @Post("governance/evaluate")
  evaluatePolicy(
    @Body()
    body: {
      policyCode: string;
      subject: string;
      context: Record<string, unknown>;
    },
  ) {
    return this.governance.evaluate(
      body.policyCode,
      body.subject,
      body.context ?? {},
    );
  }

  @Get("security/controls")
  securityControls() {
    return this.security.listControls();
  }

  @Get("security/access-decisions")
  accessDecisions() {
    return this.security.listAccessDecisions();
  }

  @Post("security/access/decide")
  decideAccess(
    @Body()
    body: {
      principalId: string;
      resourceId: string;
      action: string;
      trustScore: number;
      explicitlyEvaluated: boolean;
      context?: Record<string, unknown>;
    },
  ) {
    return this.security.decideAccess(body);
  }

  @Get("security/secrets")
  secrets() {
    return this.security.listSecrets().map((secret) => ({
      ...secret,
      encryptedValue: "[REDACTED]",
    }));
  }

  @Get("privacy/consents")
  consents() {
    return this.privacy.listConsents();
  }

  @Get("privacy/requests")
  privacyRequests() {
    return this.privacy.listPrivacyRequests();
  }

  @Get("compliance/evidence")
  complianceEvidence() {
    return this.privacy.listEvidence();
  }

  @Post("verification/run")
  verification() {
    return this.assurance.verification();
  }

  @Post("smoke/run")
  smoke() {
    return this.assurance.smoke();
  }

  @Post("certification/certify")
  certify(@Body() body: { approvedBy: string }) {
    return this.assurance.certify(body.approvedBy);
  }

  @Get("certification/status")
  certificationStatus() {
    return this.assurance.certificationStatus();
  }
}
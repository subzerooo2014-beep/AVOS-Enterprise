import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { AgpFinalPlatformCertificationService } from "./certification/agp-final-platform-certification.service";
import { AgpGovernancePlatformService } from "./governance/agp-governance-platform.service";
import { AgpFinalPlatformHealthService } from "./health/agp-final-platform-health.service";
import { AgpObservabilityProductionService } from "./operations/agp-observability-production.service";
import { AgpResilienceRecoveryService } from "./resilience/agp-resilience-recovery.service";
import { AgpArchitectureReviewService } from "./review/agp-architecture-review.service";
import { AgpSecurityTenantControlService } from "./security/agp-security-tenant-control.service";
import { AgpProductionSmokeTestService } from "./smoke/agp-production-smoke-test.service";
import { AgpTrustRiskComplianceService } from "./trust/agp-trust-risk-compliance.service";
import { AgpCrossPackVerificationService } from "./verification/agp-cross-pack-verification.service";

@Controller("avos/agp/mega-pack-7-12")
export class AgpMegaPack712Controller {
  constructor(
    private readonly governance: AgpGovernancePlatformService,
    private readonly trust: AgpTrustRiskComplianceService,
    private readonly security: AgpSecurityTenantControlService,
    private readonly resilience: AgpResilienceRecoveryService,
    private readonly operations: AgpObservabilityProductionService,
    private readonly architecture: AgpArchitectureReviewService,
    private readonly health: AgpFinalPlatformHealthService,
    private readonly verification: AgpCrossPackVerificationService,
    private readonly smoke: AgpProductionSmokeTestService,
    private readonly certification: AgpFinalPlatformCertificationService,
  ) {}

  @Get("status")
  status() {
    return this.health.status();
  }

  @Post("governance/policies")
  createPolicy(@Body() body: any) {
    return this.governance.createPolicy(body);
  }

  @Post("governance/policies/:id/activate")
  activatePolicy(
    @Param("id") id: string,
    @Body() body: { approvedBy: string },
  ) {
    return this.governance.activatePolicy(id, body.approvedBy);
  }

  @Post("governance/approvals")
  requestApproval(@Body() body: any) {
    return this.governance.requestApproval(body);
  }

  @Post("governance/approvals/:id/decide")
  decideApproval(@Param("id") id: string, @Body() body: any) {
    return this.governance.decideApproval(id, body);
  }

  @Post("trust/evidence")
  addEvidence(@Body() body: any) {
    return this.trust.addEvidence(body);
  }

  @Post("trust/decisions")
  traceDecision(@Body() body: any) {
    return this.trust.traceDecision(body);
  }

  @Post("risk/register")
  registerRisk(@Body() body: any) {
    return this.trust.registerRisk(body);
  }

  @Post("compliance/evaluate")
  evaluateCompliance(@Body() body: any) {
    return this.trust.evaluateCompliance(body);
  }

  @Get("audit")
  auditLog() {
    return this.trust.auditLog();
  }

  @Post("tenants")
  configureTenant(@Body() body: any) {
    return this.security.configureTenant(body);
  }

  @Get("tenants")
  tenants() {
    return this.security.listTenants();
  }

  @Post("tenants/:tenantId/rate-limit")
  consumeRateLimit(
    @Param("tenantId") tenantId: string,
    @Body() body: { key?: string },
  ) {
    return this.security.consumeRateLimit(
      tenantId,
      body.key ?? "requestsPerMinute",
    );
  }

  @Post("security/assess")
  assessSecurity(@Body() body: { tenantId?: string }) {
    return this.security.assess(body.tenantId);
  }

  @Post("dead-letter")
  addDeadLetter(@Body() body: any) {
    return this.resilience.addDeadLetter(body);
  }

  @Post("dead-letter/:id/replay")
  replayDeadLetter(
    @Param("id") id: string,
    @Body() body: { approvedBy: string },
  ) {
    return this.resilience.replay(id, body.approvedBy);
  }

  @Get("dead-letter")
  deadLetters() {
    return this.resilience.listDeadLetters();
  }

  @Post("observability/metrics")
  recordMetric(@Body() body: any) {
    return this.operations.recordMetric(body);
  }

  @Post("observability/traces")
  recordTrace(@Body() body: any) {
    return this.operations.trace(body);
  }

  @Get("operations/dashboard")
  operationsDashboard() {
    return this.operations.dashboard();
  }

  @Post("architecture-review/run")
  architectureReview() {
    return this.architecture.run();
  }

  @Post("verification/run")
  verify() {
    return this.verification.run();
  }

  @Get("verification/status")
  verificationStatus() {
    return this.verification.status();
  }

  @Post("smoke/run")
  smokeTest() {
    return this.smoke.run();
  }

  @Get("smoke/status")
  smokeStatus() {
    return this.smoke.status();
  }

  @Post("certification/certify")
  certify(@Body() body: { approvedBy: string }) {
    return this.certification.certify(body.approvedBy);
  }

  @Post("certification/revoke")
  revoke(@Body() body: { approvedBy: string; reason: string }) {
    return this.certification.revoke(body);
  }

  @Get("certification/status")
  certificationStatus() {
    return this.certification.status();
  }

  @Get("certification/history")
  certificationHistory() {
    return this.certification.certificationHistory();
  }
}
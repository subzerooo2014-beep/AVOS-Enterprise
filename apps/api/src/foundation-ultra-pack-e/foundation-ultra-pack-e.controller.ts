import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { ValueIntelligenceService } from "./value-intelligence.service";
import { TrustIntelligenceService } from "./trust-intelligence.service";
import { DecisionGovernanceService } from "./decision-governance.service";
import { FoundationConsolidationService } from "./foundation-consolidation.service";
import { FoundationUltraPackEStatusService } from "./foundation-ultra-pack-e-status.service";
import { FoundationUltraPackEAssuranceService } from "./foundation-ultra-pack-e-assurance.service";

@Controller("avos/foundation/ultra-pack-e")
export class FoundationUltraPackEController {
  constructor(
    private readonly value: ValueIntelligenceService,
    private readonly trust: TrustIntelligenceService,
    private readonly decisions: DecisionGovernanceService,
    private readonly consolidation: FoundationConsolidationService,
    private readonly statusService: FoundationUltraPackEStatusService,
    private readonly assurance: FoundationUltraPackEAssuranceService,
  ) {}

  @Get("status")
  status() {
    return this.statusService.status();
  }

  @Get("value/metrics")
  valueMetrics(@Query("assetId") assetId?: string) {
    return this.value.listMetrics(assetId);
  }

  @Get("value/assessments")
  valueAssessments() {
    return this.value.listAssessments();
  }

  @Get("trust/evidence")
  trustEvidence(@Query("subjectId") subjectId?: string) {
    return this.trust.listEvidence(subjectId);
  }

  @Get("trust/profiles")
  trustProfiles() {
    return this.trust.listProfiles();
  }

  @Get("decisions")
  decisionsList() {
    return this.decisions.list();
  }

  @Get("consolidation/status")
  consolidationStatus() {
    return this.consolidation.status();
  }

  @Post("consolidation/run")
  consolidate(@Body() body: { approvedBy?: string }) {
    return this.consolidation.consolidate(body.approvedBy);
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
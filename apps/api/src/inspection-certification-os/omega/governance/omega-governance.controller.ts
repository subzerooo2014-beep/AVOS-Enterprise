import { Body, Controller, Get, Post } from "@nestjs/common";
import { EvidenceRegistryService } from "./evidence-registry.service";
import { GovernancePolicyEngineService } from "./governance-policy-engine.service";
import { HumanApprovalGateService } from "./human-approval-gate.service";
import { ImmutableAuditLedgerService } from "./immutable-audit-ledger.service";
import { OmegaGovernanceOrchestratorService } from "./omega-governance-orchestrator.service";

@Controller("inspection-certification/omega/governance")
export class OmegaGovernanceController {
  constructor(
    private readonly orchestrator: OmegaGovernanceOrchestratorService,
    private readonly policies: GovernancePolicyEngineService,
    private readonly evidence: EvidenceRegistryService,
    private readonly audit: ImmutableAuditLedgerService,
    private readonly approvals: HumanApprovalGateService,
  ) {}

  @Get("status")
  status() {
    return {
      system: "AVOS Omega Governance Layer",
      pack: "Mega Pack Omega-1 Part 3",
      version: "2.0.0-omega.3",
      status: "healthy",
      capabilities: 11,
      humanFinalAuthority: true,
      autonomousFinalApproval: false,
      nonDestructive: true,
      next: "Omega-1 Part 4",
    };
  }

  @Get("policies")
  getPolicies() {
    const policies = this.policies.all();
    return { count: policies.length, policies };
  }

  @Post("assess")
  assess() {
    return this.orchestrator.assess();
  }

  @Get("latest")
  latest() {
    return {
      available: this.orchestrator.latest() !== null,
      assessment: this.orchestrator.latest(),
    };
  }

  @Get("evidence")
  getEvidence() {
    const evidence = this.evidence.all();
    return { count: evidence.length, evidence };
  }

  @Get("audit")
  getAudit() {
    return {
      verification: this.audit.verify(),
      entries: this.audit.all(),
    };
  }

  @Get("approvals")
  getApprovals() {
    const approvals = this.approvals.all();
    return { count: approvals.length, approvals };
  }

  @Post("approvals/decide")
  decideApproval(
    @Body()
    body: {
      readonly requestId: string;
      readonly approved: boolean;
      readonly decidedBy?: string;
    },
  ) {
    return this.approvals.decide({
      requestId: body.requestId,
      approved: body.approved,
      decidedBy: body.decidedBy ?? "human:khalifa",
    });
  }
}

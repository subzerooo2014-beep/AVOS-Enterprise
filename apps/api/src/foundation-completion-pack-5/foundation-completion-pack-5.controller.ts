import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { FoundationCompletionPack5Service } from "./foundation-completion-pack-5.service";
import { GovernancePolicyService } from "./policy/governance-policy.service";
import { GovernanceStandardsRegistryService } from "./standards/governance-standards-registry.service";
import { GovernanceComplianceEngineService } from "./compliance/governance-compliance-engine.service";
import { EnterpriseRiskGovernanceService } from "./risk/enterprise-risk-governance.service";
import { GovernanceLifecycleManagerService } from "./lifecycle/governance-lifecycle-manager.service";
import { GovernanceDecisionEngineService } from "./decision/governance-decision-engine.service";
import { GovernanceAuditTrailService } from "./audit/governance-audit-trail.service";
import {
  CapabilityLifecycleStage,
  GovernanceAuditEvent,
  GovernanceDecision,
  GovernancePolicy,
  GovernanceStandard,
  IdeaLifecycleStage,
  LifecycleAssetType,
  ProductLifecycleStage
} from "./foundation-pack-5.types";

@Controller("foundation-completion-v5")
export class FoundationCompletionPack5Controller {
  constructor(
    private readonly pack: FoundationCompletionPack5Service,
    private readonly policies: GovernancePolicyService,
    private readonly standards: GovernanceStandardsRegistryService,
    private readonly compliance: GovernanceComplianceEngineService,
    private readonly risks: EnterpriseRiskGovernanceService,
    private readonly lifecycles: GovernanceLifecycleManagerService,
    private readonly decisions: GovernanceDecisionEngineService,
    private readonly audit: GovernanceAuditTrailService
  ) {}

  @Get("status")
  status() {
    return this.pack.status();
  }

  @Get("verification")
  verification() {
    return this.pack.verification();
  }

  @Get("policies")
  policyList() {
    return {
      summary: this.policies.summary(),
      items: this.policies.list()
    };
  }

  @Get("policies/:id")
  policy(@Param("id") id: string) {
    return this.policies.get(id);
  }

  @Post("policies")
  registerPolicy(
    @Body() body: Omit<GovernancePolicy, "createdAt" | "updatedAt">
  ) {
    return this.policies.register(body);
  }

  @Get("policies/versions/:code")
  policyVersions(@Param("code") code: string) {
    return {
      code,
      items: this.policies.versions(code)
    };
  }

  @Get("standards")
  standardsList() {
    return {
      summary: this.standards.summary(),
      items: this.standards.list()
    };
  }

  @Post("standards")
  registerStandard(
    @Body() body: Omit<GovernanceStandard, "createdAt" | "updatedAt">
  ) {
    return this.standards.register(body);
  }

  @Get("compliance")
  complianceList() {
    return {
      summary: this.compliance.summary(),
      items: this.compliance.list()
    };
  }

  @Post("compliance/assess")
  assessCompliance(
    @Body()
    body: {
      subjectId: string;
      subjectType: string;
      policyIds: string[];
      standardIds: string[];
      evidence: Record<string, boolean>;
      assessedByIdentityId: string;
    }
  ) {
    return this.compliance.assess(body);
  }

  @Get("risks")
  risksList() {
    return {
      summary: this.risks.summary(),
      items: this.risks.list()
    };
  }

  @Post("risks")
  registerRisk(
    @Body()
    body: {
      code: string;
      title: string;
      description: string;
      category: string;
      likelihood: number;
      impact: number;
      ownerIdentityId: string;
      mitigationActions: string[];
      status: "open" | "mitigating" | "accepted" | "closed";
    }
  ) {
    return this.risks.register(body);
  }

  @Post("risks/:id/status")
  updateRiskStatus(
    @Param("id") id: string,
    @Body()
    body: {
      status: "open" | "mitigating" | "accepted" | "closed";
    }
  ) {
    return this.risks.updateStatus(id, body.status);
  }

  @Get("lifecycle")
  lifecycleList() {
    return {
      summary: this.lifecycles.summary(),
      items: this.lifecycles.list()
    };
  }

  @Get("lifecycle/:assetId")
  lifecycleHistory(@Param("assetId") assetId: string) {
    return {
      assetId,
      items: this.lifecycles.history(assetId)
    };
  }

  @Post("lifecycle/transition")
  lifecycleTransition(
    @Body()
    body: {
      assetId: string;
      assetType: LifecycleAssetType;
      stage:
        | CapabilityLifecycleStage
        | ProductLifecycleStage
        | IdeaLifecycleStage;
      previousStage?: string;
      reason: string;
      changedByIdentityId: string;
      humanApprovalRequired: boolean;
    }
  ) {
    return this.lifecycles.transition(body);
  }

  @Get("decisions")
  decisionsList() {
    return {
      summary: this.decisions.summary(),
      items: this.decisions.list()
    };
  }

  @Get("decisions/subject/:subjectId")
  decisionsBySubject(@Param("subjectId") subjectId: string) {
    return {
      subjectId,
      items: this.decisions.bySubject(subjectId)
    };
  }

  @Post("decisions")
  createDecision(
    @Body() body: Omit<GovernanceDecision, "id" | "decidedAt">
  ) {
    return this.decisions.decide(body);
  }

  @Get("audit")
  auditList() {
    return {
      summary: this.audit.summary(),
      items: this.audit.list()
    };
  }

  @Get("audit/correlation/:correlationId")
  auditByCorrelation(@Param("correlationId") correlationId: string) {
    return {
      correlationId,
      items: this.audit.byCorrelation(correlationId)
    };
  }

  @Post("audit")
  recordAudit(
    @Body() body: Omit<GovernanceAuditEvent, "id" | "occurredAt">
  ) {
    return this.audit.record(body);
  }
}

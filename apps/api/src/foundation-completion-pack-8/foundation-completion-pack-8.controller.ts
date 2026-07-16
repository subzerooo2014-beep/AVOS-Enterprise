import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { FoundationCompletionPack8Service } from "./foundation-completion-pack-8.service";
import { DigitalConstitutionService } from "./constitution/digital-constitution.service";
import { GovernancePolicyRegistryService } from "./policies/governance-policy-registry.service";
import { GovernanceStandardRegistryService } from "./standards/governance-standard-registry.service";
import { ComplianceControlRegistryService } from "./compliance/compliance-control-registry.service";
import { ComplianceAssessmentService } from "./compliance/compliance-assessment.service";
import { EnterpriseRiskRegistryService } from "./risk/enterprise-risk-registry.service";
import { GovernanceLifecycleService } from "./lifecycle/governance-lifecycle.service";
import { GovernanceExceptionService } from "./exceptions/governance-exception.service";
import { GovernanceEnforcementEngineService } from "./enforcement/governance-enforcement-engine.service";
import { GovernanceEvidenceService } from "./evidence/governance-evidence.service";
import { GovernanceAuditService } from "./observability/governance-audit.service";
import {
  ComplianceControl,
  DigitalConstitutionPrinciple,
  GovernancePolicy,
  GovernancePolicyStatus,
  GovernanceScope,
  GovernanceStandard,
  LifecycleStage
} from "./foundation-pack-8.types";

@Controller("foundation-completion-v8")
export class FoundationCompletionPack8Controller {
  constructor(
    private readonly pack: FoundationCompletionPack8Service,
    private readonly constitution: DigitalConstitutionService,
    private readonly policies: GovernancePolicyRegistryService,
    private readonly standards: GovernanceStandardRegistryService,
    private readonly controls: ComplianceControlRegistryService,
    private readonly compliance: ComplianceAssessmentService,
    private readonly risks: EnterpriseRiskRegistryService,
    private readonly lifecycle: GovernanceLifecycleService,
    private readonly exceptions: GovernanceExceptionService,
    private readonly enforcement: GovernanceEnforcementEngineService,
    private readonly evidence: GovernanceEvidenceService,
    private readonly audit: GovernanceAuditService
  ) {}

  @Get("status")
  status() {
    return this.pack.status();
  }

  @Get("verification")
  verification() {
    return this.pack.verification();
  }

  @Get("constitution")
  constitutionList() {
    return {
      summary: this.constitution.summary(),
      items: this.constitution.list()
    };
  }

  @Post("constitution")
  registerPrinciple(
    @Body()
    body: {
      principle: Omit<
        DigitalConstitutionPrinciple,
        "createdAt" | "updatedAt"
      >;
      correlationId: string;
      actorIdentityId: string;
    }
  ) {
    return this.constitution.register(
      body.principle,
      {
        correlationId: body.correlationId,
        actorIdentityId: body.actorIdentityId
      }
    );
  }

  @Get("standards")
  standardList() {
    return {
      summary: this.standards.summary(),
      items: this.standards.list()
    };
  }

  @Post("standards")
  registerStandard(
    @Body()
    body: {
      standard: Omit<
        GovernanceStandard,
        "createdAt" | "updatedAt"
      >;
      correlationId: string;
      actorIdentityId: string;
    }
  ) {
    return this.standards.register(
      body.standard,
      {
        correlationId: body.correlationId,
        actorIdentityId: body.actorIdentityId
      }
    );
  }

  @Get("policies")
  policyList() {
    return {
      summary: this.policies.summary(),
      items: this.policies.list()
    };
  }

  @Post("policies")
  registerPolicy(
    @Body()
    body: {
      policy: Omit<
        GovernancePolicy,
        "createdAt" | "updatedAt"
      >;
      correlationId: string;
      actorIdentityId: string;
    }
  ) {
    return this.policies.register(
      body.policy,
      {
        correlationId: body.correlationId,
        actorIdentityId: body.actorIdentityId
      }
    );
  }

  @Post("policies/:id/status")
  updatePolicyStatus(
    @Param("id") id: string,
    @Body()
    body: {
      status: GovernancePolicyStatus;
      correlationId: string;
      actorIdentityId: string;
    }
  ) {
    return this.policies.updateStatus(
      id,
      body.status,
      {
        correlationId: body.correlationId,
        actorIdentityId: body.actorIdentityId
      }
    );
  }

  @Get("controls")
  controlList() {
    return {
      summary: this.controls.summary(),
      items: this.controls.list()
    };
  }

  @Post("controls")
  registerControl(
    @Body()
    body: {
      control: Omit<
        ComplianceControl,
        "createdAt" | "updatedAt"
      >;
      correlationId: string;
      actorIdentityId: string;
    }
  ) {
    return this.controls.register(
      body.control,
      {
        correlationId: body.correlationId,
        actorIdentityId: body.actorIdentityId
      }
    );
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
      subjectType: GovernanceScope;
      controlId: string;
      assessedByIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.compliance.assess(body);
  }

  @Get("risks")
  riskList() {
    return {
      summary: this.risks.summary(),
      items: this.risks.list()
    };
  }

  @Post("risks")
  registerRisk(
    @Body()
    body: {
      title: string;
      description: string;
      subjectId: string;
      subjectType: GovernanceScope;
      category:
        | "strategic"
        | "operational"
        | "security"
        | "compliance"
        | "financial"
        | "reputation"
        | "technology";
      likelihood: number;
      impact: number;
      mitigationActions?: string[];
      ownerIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.risks.register(body);
  }

  @Post("risks/:id/mitigate")
  mitigateRisk(
    @Param("id") id: string,
    @Body()
    body: {
      residualScore: number;
      mitigationActions: string[];
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.risks.mitigate(id, body);
  }

  @Get("lifecycle")
  lifecycleList() {
    return {
      summary: this.lifecycle.summary(),
      items: this.lifecycle.list()
    };
  }

  @Get("lifecycle/:subjectId")
  lifecycleHistory(
    @Param("subjectId") subjectId: string
  ) {
    return {
      subjectId,
      current: this.lifecycle.current(subjectId),
      history: this.lifecycle.history(subjectId)
    };
  }

  @Post("lifecycle/transition")
  transitionLifecycle(
    @Body()
    body: {
      subjectId: string;
      subjectType: GovernanceScope;
      toStage: LifecycleStage;
      transitionReason: string;
      transitionedByIdentityId: string;
      approvedByIdentityId?: string;
      governanceChecks?: string[];
      correlationId: string;
    }
  ) {
    return this.lifecycle.transition(body);
  }

  @Get("exceptions")
  exceptionList() {
    return {
      summary: this.exceptions.summary(),
      items: this.exceptions.list()
    };
  }

  @Post("exceptions")
  requestException(
    @Body()
    body: {
      subjectId: string;
      subjectType: GovernanceScope;
      policyId: string;
      requestedByIdentityId: string;
      reason: string;
      compensatingControls?: string[];
      correlationId: string;
      expiresAt?: string;
    }
  ) {
    return this.exceptions.request(body);
  }

  @Post("exceptions/:id/decide")
  decideException(
    @Param("id") id: string,
    @Body()
    body: {
      approved: boolean;
      approverIdentityId: string;
      decisionNote: string;
      correlationId: string;
    }
  ) {
    return this.exceptions.decide(id, body);
  }

  @Get("enforcement")
  enforcementList() {
    return {
      summary: this.enforcement.summary(),
      items: this.enforcement.list()
    };
  }

  @Post("enforcement/evaluate")
  evaluateGovernance(
    @Body()
    body: {
      subjectId: string;
      subjectType: GovernanceScope;
      correlationId: string;
      action: string;
      context: Record<string, unknown>;
      evaluatedByIdentityId: string;
    }
  ) {
    return this.enforcement.evaluate(body);
  }

  @Get("evidence")
  evidenceList() {
    return {
      summary: this.evidence.summary(),
      items: this.evidence.list()
    };
  }

  @Post("evidence")
  createEvidence(
    @Body()
    body: {
      subjectId: string;
      subjectType: GovernanceScope;
      controlId?: string;
      policyId?: string;
      evidenceType:
        | "document"
        | "test-result"
        | "audit-record"
        | "approval"
        | "metric"
        | "configuration"
        | "event";
      referenceId: string;
      description: string;
      correlationId: string;
      actorIdentityId: string;
    }
  ) {
    return this.evidence.create(body);
  }

  @Post("evidence/:id/verify")
  verifyEvidence(
    @Param("id") id: string,
    @Body()
    body: {
      verifiedByIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.evidence.verify(id, body);
  }

  @Get("audit")
  auditList() {
    return {
      summary: this.audit.summary(),
      items: this.audit.list()
    };
  }

  @Get("audit/correlation/:correlationId")
  auditByCorrelation(
    @Param("correlationId") correlationId: string
  ) {
    return {
      correlationId,
      items: this.audit.byCorrelation(correlationId)
    };
  }
}

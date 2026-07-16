import {
  Body,
  Controller,
  Get,
  Param,
  Post
} from "@nestjs/common";
import { EnterpriseBrainMegaPack6Service } from "./enterprise-brain-mega-pack-6.service";
import { BrainExplainabilityService } from "./explainability/brain-explainability.service";
import { BrainDecisionTraceabilityService } from "./traceability/brain-decision-traceability.service";
import { BrainTrustScoreService } from "./trust/brain-trust-score.service";
import { BrainEvidenceVaultService } from "./evidence/brain-evidence-vault.service";
import { BrainHumanApprovalService } from "./approval/brain-human-approval.service";
import { BrainDiagnosticsService } from "./diagnostics/brain-diagnostics.service";
import { BrainTrustGovernanceService } from "./governance/brain-trust-governance.service";
import { BrainTrustDiagnosticsHealthService } from "./health/brain-trust-diagnostics-health.service";
import { BrainTrustAuditService } from "./observability/brain-trust-audit.service";
import {
  BrainDiagnosticFinding,
  BrainExplanation
} from "./enterprise-brain-mega-pack-6.types";

@Controller("enterprise-brain-v6")
export class EnterpriseBrainMegaPack6Controller {
  constructor(
    private readonly pack: EnterpriseBrainMegaPack6Service,
    private readonly explainability: BrainExplainabilityService,
    private readonly traceability: BrainDecisionTraceabilityService,
    private readonly trust: BrainTrustScoreService,
    private readonly evidence: BrainEvidenceVaultService,
    private readonly approvals: BrainHumanApprovalService,
    private readonly diagnostics: BrainDiagnosticsService,
    private readonly governance: BrainTrustGovernanceService,
    private readonly health: BrainTrustDiagnosticsHealthService,
    private readonly audit: BrainTrustAuditService
  ) {}

  @Get("status")
  status() {
    return this.pack.status();
  }

  @Get("verification")
  verification() {
    return this.pack.verification();
  }

  @Post("evidence")
  addEvidence(
    @Body()
    body: {
      subjectId: string;
      category:
        | "decision"
        | "reasoning"
        | "prediction"
        | "recommendation"
        | "plan"
        | "agent"
        | "approval"
        | "diagnostic";
      sourceType: string;
      sourceId: string;
      content: unknown;
      origin: string;
      capturedByIdentityId: string;
      confidence: number;
      correlationId: string;
    }
  ) {
    return this.evidence.add(body);
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
    return this.evidence.verify({
      evidenceId: id,
      ...body
    });
  }

  @Get("evidence")
  evidenceList() {
    return {
      summary: this.evidence.summary(),
      items: this.evidence.list()
    };
  }

  @Post("traces")
  startTrace(
    @Body()
    body: {
      subjectId: string;
      correlationId: string;
      actorIdentityId: string;
    }
  ) {
    return this.traceability.start(body);
  }

  @Post("traces/:id/events")
  addTraceEvent(
    @Param("id") id: string,
    @Body()
    body: {
      subjectId: string;
      eventType:
        | "created"
        | "context-loaded"
        | "evidence-added"
        | "reasoning-started"
        | "option-scored"
        | "risk-assessed"
        | "approval-requested"
        | "approved"
        | "rejected"
        | "completed"
        | "failed";
      actorIdentityId: string;
      input?: unknown;
      output?: unknown;
      metadata?: Record<string, unknown>;
      correlationId: string;
    }
  ) {
    return this.traceability.addEvent({
      traceId: id,
      ...body
    });
  }

  @Get("traces")
  traceList() {
    return {
      summary: this.traceability.summary(),
      items: this.traceability.list()
    };
  }

  @Post("explanations")
  generateExplanation(
    @Body()
    body: {
      subjectId: string;
      type: BrainExplanation["type"];
      summary: string;
      rationale: string[];
      evidenceIds: string[];
      assumptions?: string[];
      alternatives?: string[];
      limitations?: string[];
      confidence: number;
      riskScore: number;
      modelOrEngine: string;
      generatedByIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.explainability.generate(body);
  }

  @Get("explanations")
  explanationList() {
    return {
      summary: this.explainability.summary(),
      items: this.explainability.list()
    };
  }

  @Post("approvals")
  createApproval(
    @Body()
    body: {
      subjectId: string;
      action: string;
      reason: string;
      riskScore: number;
      requestedByIdentityId: string;
      requiredApproverRole: string;
      expiresAt?: string;
      correlationId: string;
    }
  ) {
    return this.approvals.create(body);
  }

  @Post("approvals/:id/decide")
  decideApproval(
    @Param("id") id: string,
    @Body()
    body: {
      identityId: string;
      approve: boolean;
      note?: string;
      correlationId: string;
    }
  ) {
    return this.approvals.decide({
      approvalId: id,
      ...body
    });
  }

  @Get("approvals")
  approvalList() {
    return {
      summary: this.approvals.summary(),
      items: this.approvals.list()
    };
  }

  @Post("trust/calculate")
  calculateTrust(
    @Body()
    body: {
      subjectId: string;
      confidence: number;
      riskScore: number;
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.trust.calculate(body);
  }

  @Get("trust")
  trustList() {
    return {
      summary: this.trust.summary(),
      items: this.trust.list()
    };
  }

  @Post("diagnostics/run")
  runDiagnostics(
    @Body()
    body: {
      subjectId: string;
      category: BrainDiagnosticFinding["category"];
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.diagnostics.run(body);
  }

  @Post("diagnostics/:id/resolve")
  resolveDiagnostic(
    @Param("id") id: string,
    @Body()
    body: {
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.diagnostics.resolve({
      findingId: id,
      ...body
    });
  }

  @Get("diagnostics")
  diagnosticsList() {
    return {
      summary: this.diagnostics.summary(),
      items: this.diagnostics.list()
    };
  }

  @Post("governance/assess")
  assessGovernance(
    @Body()
    body: {
      subjectId: string;
      checks: Record<string, boolean>;
      assessedByIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.governance.assess(body);
  }

  @Get("governance")
  governanceList() {
    return {
      summary: this.governance.summary(),
      items: this.governance.list()
    };
  }

  @Post("health/calculate")
  calculateHealth(
    @Body()
    body: {
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.health.calculate(body);
  }

  @Get("health")
  healthList() {
    return {
      summary: this.health.summary(),
      items: this.health.list()
    };
  }

  @Get("audit")
  auditList() {
    return {
      summary: this.audit.summary(),
      items: this.audit.list()
    };
  }
}

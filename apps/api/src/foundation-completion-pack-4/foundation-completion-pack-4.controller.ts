import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { FoundationCompletionPack4Service } from "./foundation-completion-pack-4.service";
import { ExplainableAiCoreService } from "./explainability/explainable-ai-core.service";
import { DecisionTraceabilityService } from "./traceability/decision-traceability.service";
import { DataProvenanceService } from "./provenance/data-provenance.service";
import { TrustScoreEngineService } from "./trust-score/trust-score-engine.service";
import { AuditByDesignService } from "./audit/audit-by-design.service";
import { HumanApprovalFrameworkService } from "./approval/human-approval-framework.service";
import {
  DataProvenanceRecord,
  DecisionTraceRecord,
  ExplainabilityRecord,
  HumanApprovalRequest,
  HumanApprovalStatus,
  TrustAuditEvent,
  TrustSubjectType
} from "./foundation-pack-4.types";

@Controller("foundation-completion-v4")
export class FoundationCompletionPack4Controller {
  constructor(
    private readonly pack: FoundationCompletionPack4Service,
    private readonly explainability: ExplainableAiCoreService,
    private readonly traceability: DecisionTraceabilityService,
    private readonly provenance: DataProvenanceService,
    private readonly trustScores: TrustScoreEngineService,
    private readonly audit: AuditByDesignService,
    private readonly approvals: HumanApprovalFrameworkService
  ) {}

  @Get("status")
  status() {
    return this.pack.status();
  }

  @Get("verification")
  verification() {
    return this.pack.verification();
  }

  @Get("explainability")
  explainabilityRecords() {
    return {
      summary: this.explainability.summary(),
      items: this.explainability.list()
    };
  }

  @Post("explainability")
  registerExplainability(
    @Body() body: Omit<ExplainabilityRecord, "id" | "createdAt">
  ) {
    return this.explainability.register(body);
  }

  @Get("decision-traces")
  decisionTraces() {
    return {
      summary: this.traceability.summary(),
      items: this.traceability.list()
    };
  }

  @Get("decision-traces/chain/:decisionId")
  decisionChain(@Param("decisionId") decisionId: string) {
    return this.traceability.chain(decisionId);
  }

  @Post("decision-traces")
  registerDecisionTrace(
    @Body() body: Omit<DecisionTraceRecord, "id" | "createdAt">
  ) {
    return this.traceability.register(body);
  }

  @Get("provenance")
  provenanceRecords() {
    return {
      summary: this.provenance.summary(),
      items: this.provenance.list()
    };
  }

  @Get("provenance/asset/:assetId")
  provenanceByAsset(@Param("assetId") assetId: string) {
    return {
      assetId,
      items: this.provenance.byAsset(assetId)
    };
  }

  @Post("provenance")
  registerProvenance(
    @Body() body: Omit<DataProvenanceRecord, "id" | "updatedAt">
  ) {
    return this.provenance.register(body);
  }

  @Get("trust-scores")
  trustScoresList() {
    return {
      summary: this.trustScores.summary(),
      items: this.trustScores.list()
    };
  }

  @Get("trust-scores/subject/:subjectId")
  trustScoresBySubject(@Param("subjectId") subjectId: string) {
    return {
      subjectId,
      items: this.trustScores.getBySubject(subjectId)
    };
  }

  @Post("trust-scores/calculate")
  calculateTrustScore(
    @Body()
    body: {
      subjectId: string;
      subjectType: TrustSubjectType;
      reliability: number;
      transparency: number;
      provenanceQuality: number;
      compliance: number;
      humanOversight: number;
      reasons?: string[];
    }
  ) {
    return this.trustScores.calculate(body);
  }

  @Get("audit")
  auditEvents() {
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
    @Body() body: Omit<TrustAuditEvent, "id" | "occurredAt">
  ) {
    return this.audit.record(body);
  }

  @Get("approvals")
  approvalRequests() {
    return {
      summary: this.approvals.summary(),
      items: this.approvals.list()
    };
  }

  @Post("approvals")
  createApproval(
    @Body()
    body: Omit<
      HumanApprovalRequest,
      "id" | "status" | "createdAt" | "resolvedAt"
    >
  ) {
    return this.approvals.create(body);
  }

  @Post("approvals/:id/resolve")
  resolveApproval(
    @Param("id") id: string,
    @Body()
    body: {
      status: Extract<
        HumanApprovalStatus,
        "approved" | "rejected" | "escalated" | "executed"
      >;
      approverIdentityId: string;
    }
  ) {
    return this.approvals.resolve(id, body);
  }
}

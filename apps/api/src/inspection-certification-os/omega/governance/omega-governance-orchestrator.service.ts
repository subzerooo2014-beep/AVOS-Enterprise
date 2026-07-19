import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { ComplianceIntelligenceEngineService } from "./compliance-intelligence-engine.service";
import { DataProvenanceEngineService } from "./data-provenance-engine.service";
import { DecisionTraceabilityEngineService } from "./decision-traceability-engine.service";
import { EvidenceRegistryService } from "./evidence-registry.service";
import { ExplainabilityEngineService } from "./explainability-engine.service";
import { HumanApprovalGateService } from "./human-approval-gate.service";
import { ImmutableAuditLedgerService } from "./immutable-audit-ledger.service";
import { GovernanceAssessment } from "./omega-governance.types";
import { TrustScoreEngineService } from "./trust-score-engine.service";

@Injectable()
export class OmegaGovernanceOrchestratorService {
  private latestAssessment: GovernanceAssessment | null = null;

  constructor(
    private readonly evidenceRegistry: EvidenceRegistryService,
    private readonly provenance: DataProvenanceEngineService,
    private readonly audit: ImmutableAuditLedgerService,
    private readonly compliance: ComplianceIntelligenceEngineService,
    private readonly trust: TrustScoreEngineService,
    private readonly explainability: ExplainabilityEngineService,
    private readonly traceability: DecisionTraceabilityEngineService,
    private readonly approvals: HumanApprovalGateService,
  ) {}

  assess(): GovernanceAssessment {
    const assessmentId = `OMEGA-GOV-${randomUUID()}`;

    const evidence = [
      this.evidenceRegistry.capture({
        source: "omega-intelligence",
        category: "architecture",
        payload: { healthy: true, nonDestructive: true },
      }),
      this.evidenceRegistry.capture({
        source: "omega-certification",
        category: "certification",
        payload: {
          humanFinalAuthority: true,
          autonomousFinalApproval: false,
        },
      }),
      this.evidenceRegistry.capture({
        source: "omega-governance",
        category: "policy",
        payload: { policiesLoaded: true },
      }),
    ];

    this.audit.append({
      action: "governance-assessment-started",
      actor: "omega-governance-engine",
      subjectId: assessmentId,
    });

    const provenance = this.provenance.evaluate(evidence);

    const explanation = this.explainability.explain({
      subjectId: assessmentId,
      metrics: {
        provenance: provenance.score,
        audit: 100,
        humanAuthority: 100,
        policyCoverage: 100,
      },
    });

    const preliminaryTraceability = 100;
    const preliminaryCompliance = this.compliance.evaluate({
      trust: 100,
      explainability: explanation.score,
      traceability: preliminaryTraceability,
      provenance: provenance.score,
      humanFinalAuthority: true,
    });

    const auditStatus = this.audit.verify();

    const trust = this.trust.calculate({
      compliance: preliminaryCompliance.score,
      explainability: explanation.score,
      traceability: preliminaryTraceability,
      provenance: provenance.score,
      auditValid: auditStatus.valid,
    });

    const finalCompliance = this.compliance.evaluate({
      trust,
      explainability: explanation.score,
      traceability: preliminaryTraceability,
      provenance: provenance.score,
      humanFinalAuthority: true,
    });

    const compliant = finalCompliance.score >= 66.67;

    const decision = this.traceability.create({
      subjectId: assessmentId,
      compliant,
      rationale: [
        ...explanation.rationale,
        `compliance=${finalCompliance.score}`,
        `trust=${trust}`,
        `provenance=${provenance.score}`,
      ],
      evidence,
    });

    const traceability = this.traceability.score(decision);
    const approvalRequest = this.approvals.request(assessmentId);

    this.audit.append({
      action: "governance-decision-created",
      actor: "omega-governance-engine",
      subjectId: decision.decisionId,
    });

    const assessment: GovernanceAssessment = {
      assessmentId,
      generatedAt: new Date().toISOString(),
      version: "2.0.0-omega.3",
      scores: {
        compliance: finalCompliance.score,
        trust,
        explainability: explanation.score,
        traceability,
        provenance: provenance.score,
      },
      policyResults: finalCompliance.results,
      evidence,
      decision,
      approvalRequest: {
        requestId: approvalRequest.requestId,
        status: "pending",
      },
      governance: {
        humanFinalAuthority: true,
        autonomousFinalApproval: false,
        immutableAuditIntent: true,
        nonDestructive: true,
      },
    };

    this.latestAssessment = assessment;
    return assessment;
  }

  latest(): GovernanceAssessment | null {
    return this.latestAssessment;
  }
}

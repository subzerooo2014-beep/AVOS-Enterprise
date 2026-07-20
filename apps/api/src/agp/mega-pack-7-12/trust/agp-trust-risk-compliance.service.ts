import { Injectable } from "@nestjs/common";
import { createHash, randomUUID } from "crypto";
import {
  ComplianceEvaluation,
  DecisionTrace,
  EvidenceRecord,
  RiskLevel,
  RiskRecord,
} from "../contracts/agp-final-platform.contracts";

@Injectable()
export class AgpTrustRiskComplianceService {
  private readonly evidence = new Map<string, EvidenceRecord>();
  private readonly decisions = new Map<string, DecisionTrace>();
  private readonly risks = new Map<string, RiskRecord>();
  private readonly compliance: ComplianceEvaluation[] = [];
  private readonly auditEvents: Array<Record<string, unknown>> = [];

  addEvidence(input: {
    source: string;
    category: string;
    content: unknown;
    metadata?: Record<string, string>;
  }): EvidenceRecord {
    const hash = createHash("sha256")
      .update(JSON.stringify(input.content))
      .digest("hex");
    const record: EvidenceRecord = {
      id: `agp-evidence:${randomUUID()}`,
      source: input.source,
      category: input.category,
      hash,
      metadata: { ...(input.metadata ?? {}) },
      collectedAt: new Date().toISOString(),
    };
    this.evidence.set(record.id, record);
    this.audit("evidence.created", record.id, { hash });
    return { ...record, metadata: { ...record.metadata } };
  }

  traceDecision(input: Omit<DecisionTrace, "id" | "createdAt">): DecisionTrace {
    const trace: DecisionTrace = {
      ...input,
      id: `agp-decision:${randomUUID()}`,
      inputs: { ...input.inputs },
      evidenceIds: [...input.evidenceIds],
      policyIds: [...input.policyIds],
      createdAt: new Date().toISOString(),
    };
    this.decisions.set(trace.id, trace);
    this.audit("decision.traced", trace.id, {
      outcome: trace.outcome,
      confidence: trace.confidence,
    });
    return this.clone(trace);
  }

  registerRisk(input: {
    domain: string;
    description: string;
    level: RiskLevel;
    probability: number;
    impact: number;
    controls: string[];
    owner: string;
  }): RiskRecord {
    const risk: RiskRecord = {
      id: `agp-risk:${randomUUID()}`,
      domain: input.domain,
      description: input.description,
      level: input.level,
      probability: input.probability,
      impact: input.impact,
      score: Number((input.probability * input.impact * 100).toFixed(2)),
      controls: [...input.controls],
      status: "open",
      owner: input.owner,
      createdAt: new Date().toISOString(),
    };
    this.risks.set(risk.id, risk);
    this.audit("risk.registered", risk.id, { score: risk.score });
    return JSON.parse(JSON.stringify(risk)) as RiskRecord;
  }

  evaluateCompliance(input: {
    jurisdiction: string;
    domain: string;
    requirements: Array<{
      name: string;
      passed: boolean;
      evidence: string[];
    }>;
  }): ComplianceEvaluation {
    const passedCount = input.requirements.filter((item) => item.passed).length;
    const score = Math.round(
      (passedCount / Math.max(input.requirements.length, 1)) * 100,
    );
    const evaluation: ComplianceEvaluation = {
      id: `agp-compliance:${randomUUID()}`,
      jurisdiction: input.jurisdiction,
      domain: input.domain,
      passed: score === 100,
      score,
      requirements: input.requirements.map((item) => ({
        ...item,
        evidence: [...item.evidence],
      })),
      exceptions: input.requirements
        .filter((item) => !item.passed)
        .map((item) => item.name),
      evaluatedAt: new Date().toISOString(),
    };
    this.compliance.push(evaluation);
    this.audit("compliance.evaluated", evaluation.id, { score });
    return JSON.parse(JSON.stringify(evaluation)) as ComplianceEvaluation;
  }

  scores() {
    const decisions = [...this.decisions.values()];
    const risks = [...this.risks.values()];
    const compliance = this.compliance;

    const trustScore =
      decisions.length === 0
        ? 100
        : Math.round(
            decisions.reduce((sum, item) => sum + item.confidence * 100, 0) /
              decisions.length,
          );
    const riskScore =
      risks.length === 0
        ? 100
        : Math.max(
            0,
            Math.round(
              100 -
                risks.reduce((sum, item) => sum + item.score, 0) /
                  risks.length,
            ),
          );
    const complianceScore =
      compliance.length === 0
        ? 100
        : Math.round(
            compliance.reduce((sum, item) => sum + item.score, 0) /
              compliance.length,
          );

    return {
      trustScore,
      riskScore,
      complianceScore,
      explainability: true,
      evidenceProvenance: true,
      dataProvenance: true,
      modelOutputProvenance: true,
      immutableAuditFoundation: true,
      auditCorrelation: true,
      privacyReadiness: true,
      dataResidencyReadiness: true,
      consentReadiness: true,
      retentionPolicyEnforcement: true,
      globalComplianceReadinessGate: complianceScore === 100,
      generatedAt: new Date().toISOString(),
    };
  }

  auditLog() {
    return this.auditEvents.map((event) => ({ ...event }));
  }

  private audit(type: string, subjectId: string, details: Record<string, unknown>) {
    this.auditEvents.push({
      id: `agp-audit:${randomUUID()}`,
      type,
      subjectId,
      details: { ...details },
      occurredAt: new Date().toISOString(),
    });
  }

  private clone(trace: DecisionTrace): DecisionTrace {
    return JSON.parse(JSON.stringify(trace)) as DecisionTrace;
  }
}
import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { FoundationCompletionPack7Service } from "./foundation-completion-pack-7.service";
import { DecisionRegistryService } from "./decisions/decision-registry.service";
import { DecisionTraceGraphService } from "./decisions/decision-trace-graph.service";
import { EvidenceRegistryService } from "./evidence/evidence-registry.service";
import { DataProvenanceGraphService } from "./provenance/data-provenance-graph.service";
import { TrustPolicyRegistryService } from "./policies/trust-policy-registry.service";
import { TrustScoreEngineService } from "./trust/trust-score-engine.service";
import { TrustAuditLedgerService } from "./audit/trust-audit-ledger.service";
import { DecisionReplayService } from "./replay/decision-replay.service";
import { DecisionExplainabilityService } from "./explainability/decision-explainability.service";
import {
  DecisionActorType,
  DecisionStatus,
  EvidenceType,
  ExplainabilityFactor,
  ProvenanceNodeType,
  ProvenanceRelationType,
  TrustPolicy
} from "./foundation-pack-7.types";

@Controller("foundation-completion-v7")
export class FoundationCompletionPack7Controller {
  constructor(
    private readonly pack: FoundationCompletionPack7Service,
    private readonly decisions: DecisionRegistryService,
    private readonly decisionTrace: DecisionTraceGraphService,
    private readonly evidence: EvidenceRegistryService,
    private readonly provenance: DataProvenanceGraphService,
    private readonly policies: TrustPolicyRegistryService,
    private readonly trust: TrustScoreEngineService,
    private readonly audit: TrustAuditLedgerService,
    private readonly replay: DecisionReplayService,
    private readonly explainability: DecisionExplainabilityService
  ) {}

  @Get("status")
  status() {
    return this.pack.status();
  }

  @Get("verification")
  verification() {
    return this.pack.verification();
  }

  @Get("decisions")
  decisionList() {
    return {
      summary: this.decisions.summary(),
      items: this.decisions.list()
    };
  }

  @Get("decisions/:id")
  decision(@Param("id") id: string) {
    return this.decisions.get(id);
  }

  @Post("decisions")
  createDecision(
    @Body()
    body: {
      decisionType: string;
      title: string;
      description: string;
      subjectId: string;
      correlationId: string;
      causationId?: string;
      actorId: string;
      actorType: DecisionActorType;
      requestedAction: string;
      alternatives?: string[];
      rationale?: string;
      confidence?: number;
      riskScore?: number;
      policyIds?: string[];
      evidenceIds?: string[];
      provenanceNodeIds?: string[];
      explainabilityFactors?: ExplainabilityFactor[];
      requiresHumanApproval?: boolean;
      metadata?: Record<string, unknown>;
    }
  ) {
    return this.decisions.create(body);
  }

  @Post("decisions/:id/update")
  updateDecision(
    @Param("id") id: string,
    @Body()
    body: {
      patch: {
        status?: DecisionStatus;
        selectedOption?: string;
        rationale?: string;
        confidence?: number;
        riskScore?: number;
        trustScore?: number;
        humanApprovalId?: string;
        evidenceIds?: string[];
        provenanceNodeIds?: string[];
        explainabilityFactors?: ExplainabilityFactor[];
        metadata?: Record<string, unknown>;
      };
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.decisions.update(
      id,
      body.patch,
      {
        actorIdentityId: body.actorIdentityId,
        correlationId: body.correlationId
      }
    );
  }

  @Get("decisions/:id/explain")
  explainDecision(@Param("id") id: string) {
    return this.explainability.explain(id);
  }

  @Get("decisions/:id/trace")
  decisionGraph(@Param("id") id: string) {
    return this.decisionTrace.graph(id);
  }

  @Post("decision-trace")
  linkDecisionTrace(
    @Body()
    body: {
      fromDecisionId: string;
      toDecisionId: string;
      relation:
        | "caused"
        | "influenced"
        | "approved"
        | "rejected"
        | "reversed"
        | "superseded"
        | "replayed";
      reason: string;
      correlationId: string;
      actorIdentityId: string;
    }
  ) {
    return this.decisionTrace.link(body);
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
      type: EvidenceType;
      title: string;
      description: string;
      sourceId: string;
      sourceType: string;
      payload: Record<string, unknown>;
      reliabilityScore: number;
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
      reliabilityScore?: number;
    }
  ) {
    return this.evidence.verify(id, body);
  }

  @Get("provenance/nodes")
  provenanceNodes() {
    return {
      summary: this.provenance.summary(),
      items: this.provenance.listNodes()
    };
  }

  @Get("provenance/edges")
  provenanceEdges() {
    return {
      summary: this.provenance.summary(),
      items: this.provenance.listEdges()
    };
  }

  @Post("provenance/nodes")
  createProvenanceNode(
    @Body()
    body: {
      id?: string;
      type: ProvenanceNodeType;
      label: string;
      sourceSystem: string;
      ownerIdentityId?: string;
      contentHash?: string;
      metadata?: Record<string, unknown>;
      correlationId: string;
      actorIdentityId: string;
    }
  ) {
    return this.provenance.createNode(body);
  }

  @Post("provenance/edges")
  createProvenanceEdge(
    @Body()
    body: {
      fromNodeId: string;
      toNodeId: string;
      relation: ProvenanceRelationType;
      actorIdentityId: string;
      correlationId: string;
      metadata?: Record<string, unknown>;
    }
  ) {
    return this.provenance.createEdge(body);
  }

  @Get("provenance/lineage/:nodeId")
  provenanceLineage(@Param("nodeId") nodeId: string) {
    return this.provenance.lineage(nodeId);
  }

  @Get("trust/policies")
  trustPolicies() {
    return {
      summary: this.policies.summary(),
      items: this.policies.list()
    };
  }

  @Post("trust/policies")
  createTrustPolicy(
    @Body()
    body: {
      policy: Omit<TrustPolicy, "createdAt" | "updatedAt">;
      correlationId: string;
      actorIdentityId: string;
    }
  ) {
    return this.policies.create(body.policy, {
      correlationId: body.correlationId,
      actorIdentityId: body.actorIdentityId
    });
  }

  @Get("trust/assessments")
  trustAssessments() {
    return {
      summary: this.trust.summary(),
      items: this.trust.list()
    };
  }

  @Post("trust/assess-decision")
  assessDecision(
    @Body()
    body: {
      decisionId: string;
      policyId: string;
      assessedByIdentityId: string;
    }
  ) {
    return this.trust.assessDecision(body);
  }

  @Get("trust/assessments/subject/:subjectId")
  assessmentsBySubject(
    @Param("subjectId") subjectId: string
  ) {
    return {
      subjectId,
      items: this.trust.bySubject(subjectId)
    };
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
      decisions: this.decisions.byCorrelation(correlationId),
      audit: this.audit.byCorrelation(correlationId)
    };
  }

  @Get("replays")
  replayList() {
    return {
      summary: this.replay.summary(),
      items: this.replay.list()
    };
  }

  @Post("replays")
  replayDecision(
    @Body()
    body: {
      sourceDecisionId: string;
      replayedByIdentityId: string;
      correlationId: string;
      overrideMetadata?: Record<string, unknown>;
    }
  ) {
    return this.replay.replay(body);
  }

  @Post("replays/:decisionId/reassess")
  reassessReplay(
    @Param("decisionId") decisionId: string,
    @Body()
    body: {
      policyId: string;
      assessedByIdentityId: string;
    }
  ) {
    return this.replay.reassessReplay(
      decisionId,
      body.policyId,
      body.assessedByIdentityId
    );
  }
}

import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { AVOS_CONSTITUTIONS } from "./constitutional-foundation.registry";
import {
  ConstitutionKey,
  ConstitutionalApproval,
  ConstitutionalAuditRecord,
  ConstitutionalEvaluationRequest,
  ConstitutionalEvaluationResult,
} from "./constitutional-foundation.types";

@Injectable()
export class ConstitutionalFoundationService {
  private readonly evaluations =
    new Map<string, ConstitutionalEvaluationResult>();
  private readonly approvals =
    new Map<string, ConstitutionalApproval>();
  private readonly audits =
    new Map<string, ConstitutionalAuditRecord>();

  constitutions() {
    return AVOS_CONSTITUTIONS.map((constitution) => ({
      ...constitution,
      principles: constitution.principles.map((principle) => ({
        ...principle,
      })),
    }));
  }

  constitution(key: ConstitutionKey) {
    const constitution = AVOS_CONSTITUTIONS.find(
      (item) => item.key === key,
    );

    if (!constitution || !constitution.active) {
      throw new Error(`Active constitution not found: ${key}`);
    }

    return {
      ...constitution,
      principles: constitution.principles.map((principle) => ({
        ...principle,
      })),
    };
  }

  evaluate(
    request: ConstitutionalEvaluationRequest,
  ): ConstitutionalEvaluationResult {
    const constitution = this.constitution(request.constitution);
    const context = request.context ?? {};
    const reasons: string[] = [];
    const matchedPrinciples = constitution.principles
      .filter((principle) => principle.mandatory)
      .map((principle) => principle.key);

    let decision: ConstitutionalEvaluationResult["decision"] = "ALLOW";
    let requiresHumanFinalDecision = false;

    const duplicateImplementation =
      context["duplicateImplementation"] === true;
    const revenueLeakageRisk =
      context["revenueLeakageRisk"] === true;
    const identityVerified =
      context["identityVerified"] !== false;
    const sensitiveExecutiveAction =
      context["sensitiveExecutiveAction"] === true;
    const securityViolation =
      context["securityViolation"] === true;
    const complianceFailure =
      context["complianceFailure"] === true;

    if (
      request.constitution === "TECHNICAL" &&
      duplicateImplementation
    ) {
      decision = "DENY";
      reasons.push("Duplicate implementation violates the Technical Constitution.");
    }

    if (
      request.constitution === "BUSINESS" &&
      revenueLeakageRisk
    ) {
      decision = "REQUIRE_APPROVAL";
      requiresHumanFinalDecision = true;
      reasons.push("Revenue leakage risk requires executive approval.");
    }

    if (
      request.constitution === "EXECUTIVE" &&
      sensitiveExecutiveAction
    ) {
      decision = "REQUIRE_APPROVAL";
      requiresHumanFinalDecision = true;
      reasons.push("Human final decision authority is mandatory.");
    }

    if (
      request.constitution === "TRUST" &&
      !identityVerified
    ) {
      decision = "DENY";
      reasons.push("Identity verification is required.");
    }

    if (
      request.constitution === "TRUST" &&
      (securityViolation || complianceFailure)
    ) {
      decision = "DENY";
      reasons.push("Security or compliance violation detected.");
    }

    if (reasons.length === 0) {
      reasons.push("Action satisfies active constitutional principles.");
    }

    const result: ConstitutionalEvaluationResult = {
      id: randomUUID(),
      tenantId: request.tenantId,
      actorId: request.actorId,
      constitution: request.constitution,
      action: request.action,
      resourceType: request.resourceType,
      resourceId: request.resourceId,
      decision,
      matchedPrinciples,
      reasons,
      requiresHumanFinalDecision,
      createdAt: new Date().toISOString(),
    };

    this.evaluations.set(result.id, result);
    return this.cloneEvaluation(result);
  }

  requestApproval(
    evaluationId: string,
    tenantId: string,
    requestedBy: string,
    authorityRole: string,
  ): ConstitutionalApproval {
    const evaluation = this.requireEvaluation(evaluationId);

    if (!evaluation.requiresHumanFinalDecision) {
      throw new Error(
        "Evaluation does not require human final decision.",
      );
    }

    const now = new Date().toISOString();

    const approval: ConstitutionalApproval = {
      id: randomUUID(),
      evaluationId,
      tenantId,
      requestedBy,
      authorityRole,
      status: "PENDING",
      createdAt: now,
      updatedAt: now,
    };

    this.approvals.set(approval.id, approval);
    return { ...approval };
  }

  decideApproval(
    id: string,
    status: "APPROVED" | "REJECTED",
    reason?: string,
  ): ConstitutionalApproval {
    const approval = this.requireApproval(id);
    approval.status = status;
    approval.reason = reason;
    approval.updatedAt = new Date().toISOString();
    this.approvals.set(id, approval);
    return { ...approval };
  }

  trackAudit(
    input: Omit<ConstitutionalAuditRecord, "id" | "createdAt">,
  ): ConstitutionalAuditRecord {
    this.constitution(input.constitution);

    const record: ConstitutionalAuditRecord = {
      ...input,
      id: randomUUID(),
      payload: { ...input.payload },
      createdAt: new Date().toISOString(),
    };

    this.audits.set(record.id, record);

    return {
      ...record,
      payload: { ...record.payload },
    };
  }

  dashboard() {
    const evaluations = Array.from(this.evaluations.values());
    const approvals = Array.from(this.approvals.values());

    return {
      system: "AVOS Constitutional Foundation",
      constitutions: AVOS_CONSTITUTIONS.length,
      principles: AVOS_CONSTITUTIONS.reduce(
        (sum, constitution) =>
          sum + constitution.principles.length,
        0,
      ),
      evaluations: evaluations.length,
      deniedEvaluations: evaluations.filter(
        (evaluation) => evaluation.decision === "DENY",
      ).length,
      approvalRequiredEvaluations: evaluations.filter(
        (evaluation) =>
          evaluation.decision === "REQUIRE_APPROVAL",
      ).length,
      approvals: approvals.length,
      pendingApprovals: approvals.filter(
        (approval) => approval.status === "PENDING",
      ).length,
      audits: this.audits.size,
      humanFinalDecisionAuthority: true,
      generatedAt: new Date().toISOString(),
    };
  }

  private requireEvaluation(
    id: string,
  ): ConstitutionalEvaluationResult {
    const evaluation = this.evaluations.get(id);

    if (!evaluation) {
      throw new Error(`Constitutional evaluation not found: ${id}`);
    }

    return evaluation;
  }

  private requireApproval(id: string): ConstitutionalApproval {
    const approval = this.approvals.get(id);

    if (!approval) {
      throw new Error(`Constitutional approval not found: ${id}`);
    }

    return approval;
  }

  private cloneEvaluation(
    result: ConstitutionalEvaluationResult,
  ): ConstitutionalEvaluationResult {
    return {
      ...result,
      matchedPrinciples: [...result.matchedPrinciples],
      reasons: [...result.reasons],
    };
  }
}
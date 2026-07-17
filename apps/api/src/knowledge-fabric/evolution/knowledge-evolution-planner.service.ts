import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { KnowledgeEvolutionAssessment, KnowledgeEvolutionCandidate, KnowledgeEvolutionPlan } from "./knowledge-evolution.types";

@Injectable()
export class KnowledgeEvolutionPlannerService {
  create(candidate: KnowledgeEvolutionCandidate, assessment: KnowledgeEvolutionAssessment): KnowledgeEvolutionPlan {
    const now = new Date().toISOString();
    return {
      id: randomUUID(),
      candidateId: candidate.id,
      stage: assessment.compatible ? "APPROVED" : "VALIDATING",
      steps: ["capture-current-version", "validate-dependencies", "apply-change", "verify-integrity", "publish-evolution-event"],
      rollbackSteps: ["restore-previous-version", "restore-dependencies", "publish-rollback-event"],
      requiresApproval: assessment.riskScore >= 40 || candidate.changeType === "RETIRE",
      createdAt: now,
      updatedAt: now,
    };
  }
}
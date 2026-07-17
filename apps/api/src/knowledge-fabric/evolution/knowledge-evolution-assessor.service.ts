import { Injectable, NotFoundException } from "@nestjs/common";
import { KnowledgeEvolutionAssessment, KnowledgeEvolutionCandidate } from "./knowledge-evolution.types";

@Injectable()
export class KnowledgeEvolutionAssessorService {
  assess(candidate: KnowledgeEvolutionCandidate): KnowledgeEvolutionAssessment {
    if (!candidate) throw new NotFoundException("Evolution candidate was not found");
    const confidence = Math.max(0, Math.min(1, candidate.confidence));
    const impact = Math.max(0, Math.min(100, candidate.impactScore));
    const riskScore = Math.round((1 - confidence) * 60 + impact * 0.4);
    const compatible = riskScore < 70 && candidate.targetVersion > candidate.sourceVersion;
    return {
      candidateId: candidate.id,
      compatible,
      qualityDelta: Math.round(confidence * 20),
      trustDelta: Math.round(confidence * 15),
      riskScore,
      affectedKnowledgeIds: [candidate.knowledgeId],
      findings: compatible ? ["Evolution candidate is compatible with current knowledge state."] : ["Evolution candidate requires remediation before application."],
      assessedAt: new Date().toISOString(),
    };
  }
}
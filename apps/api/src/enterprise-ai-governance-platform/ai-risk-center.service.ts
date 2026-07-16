import { Injectable } from "@nestjs/common";
import type {
  AiRiskAssessmentRecord,
  AiRiskLevel,
} from "./enterprise-ai-governance.types";

@Injectable()
export class AiRiskCenterService {
  private readonly assessments: AiRiskAssessmentRecord[] = [];

  assess(
    targetType: AiRiskAssessmentRecord["targetType"],
    targetId: string,
    score: number,
    findings: string[] = [],
    mitigations: string[] = [],
  ): AiRiskAssessmentRecord {
    const level = this.toLevel(score);

    const assessment: AiRiskAssessmentRecord = {
      id: `ai-risk-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      targetType,
      targetId,
      level,
      score,
      findings: [...findings],
      mitigations: [...mitigations],
      assessedAt: new Date().toISOString(),
    };

    this.assessments.unshift(assessment);

    if (this.assessments.length > 5000) {
      this.assessments.length = 5000;
    }

    return this.clone(assessment);
  }

  list(): AiRiskAssessmentRecord[] {
    return this.assessments.map((assessment) => this.clone(assessment));
  }

  count(): number {
    return this.assessments.length;
  }

  highRiskCount(): number {
    return this.assessments.filter(
      (assessment) =>
        assessment.level === "HIGH" || assessment.level === "CRITICAL",
    ).length;
  }

  private toLevel(score: number): AiRiskLevel {
    if (score >= 80) return "CRITICAL";
    if (score >= 60) return "HIGH";
    if (score >= 30) return "MEDIUM";
    return "LOW";
  }

  private clone(
    assessment: AiRiskAssessmentRecord,
  ): AiRiskAssessmentRecord {
    return {
      ...assessment,
      findings: [...assessment.findings],
      mitigations: [...assessment.mitigations],
    };
  }
}

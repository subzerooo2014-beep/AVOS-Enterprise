import { Injectable } from "@nestjs/common";

@Injectable()
export class EnterpriseKnowledgeAcademyService {
  evaluate(input: {
    completionScore: number;
    assessmentScore: number;
    applicationScore: number;
    retentionScore: number;
  }) {
    const academyScore = Math.round(
      input.completionScore * 0.2 +
        input.assessmentScore * 0.3 +
        input.applicationScore * 0.3 +
        input.retentionScore * 0.2,
    );

    return {
      academyScore,
      certification:
        academyScore >= 85
          ? "ADVANCED"
          : academyScore >= 70
            ? "CERTIFIED"
            : "IN_PROGRESS",
    };
  }
}

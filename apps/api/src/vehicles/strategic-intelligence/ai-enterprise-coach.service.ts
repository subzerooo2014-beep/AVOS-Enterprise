import { Injectable } from "@nestjs/common";

@Injectable()
export class AiEnterpriseCoachService {
  coach(input: {
    performanceScore: number;
    adoptionScore: number;
    disciplineScore: number;
    learningScore: number;
  }) {
    const coachingScore = Math.round(
      input.performanceScore * 0.3 +
        input.adoptionScore * 0.2 +
        input.disciplineScore * 0.25 +
        input.learningScore * 0.25,
    );

    return {
      coachingScore,
      recommendation:
        coachingScore >= 80
          ? "SCALE_CAPABILITY"
          : coachingScore >= 60
            ? "TARGETED_IMPROVEMENT"
            : "FOUNDATION_REBUILD",
    };
  }
}

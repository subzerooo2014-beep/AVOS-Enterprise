import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";

@Injectable()
export class ContinuousLearningService {
  private readonly lessons: Array<Record<string, unknown>> = [];

  learn(input: {
    source: string;
    outcome: string;
    expectedValue: number;
    actualValue: number;
    evidence?: unknown[];
  }) {
    const variance = input.actualValue - input.expectedValue;
    const lesson = {
      id: "aeos-lesson:" + randomUUID(),
      source: input.source,
      outcome: input.outcome,
      expectedValue: input.expectedValue,
      actualValue: input.actualValue,
      variance,
      adjustment:
        variance < 0
          ? "reduce-confidence-and-replan"
          : variance > 0
            ? "increase-confidence"
            : "retain-current-policy",
      evidence: input.evidence ?? [],
      learnedAt: new Date().toISOString(),
    };

    this.lessons.unshift(lesson);
    return lesson;
  }

  list() {
    return this.lessons;
  }

  profile() {
    const negative = this.lessons.filter(
      (lesson) => Number(lesson.variance) < 0,
    ).length;

    return {
      lessons: this.lessons.length,
      negativeOutcomes: negative,
      adaptationRequired: negative > 0,
      maturityScore: Math.min(100, 60 + this.lessons.length * 2),
    };
  }
}
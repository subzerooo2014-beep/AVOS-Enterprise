import { Injectable } from "@nestjs/common";
import { ContinuousLearningService } from "./continuous-learning.service";

@Injectable()
export class EnterpriseFeedbackLoopService {
  constructor(private readonly learning: ContinuousLearningService) {}

  close(input: {
    executionId: string;
    expectedValue: number;
    actualValue: number;
    sourceUnit: string;
    evidence?: unknown[];
  }) {
    const lesson = this.learning.learn({
      source: input.sourceUnit,
      outcome: input.executionId,
      expectedValue: input.expectedValue,
      actualValue: input.actualValue,
      evidence: input.evidence,
    });

    return {
      executionId: input.executionId,
      lesson,
      nextAction:
        Number(lesson.variance) < 0
          ? "trigger-plan-review"
          : "continue-and-monitor",
      closedAt: new Date().toISOString(),
    };
  }
}
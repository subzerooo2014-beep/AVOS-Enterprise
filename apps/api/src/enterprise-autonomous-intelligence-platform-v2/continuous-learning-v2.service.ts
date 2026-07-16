import { Injectable } from "@nestjs/common";
import type { IntelligenceLearningV2 } from "./autonomous-intelligence-v2.types";

@Injectable()
export class ContinuousLearningV2Service {
  private readonly learnings: IntelligenceLearningV2[] = [];

  record(
    sourceId: string,
    lesson: string,
    score: number,
    metadata: Record<string, unknown> = {},
  ): IntelligenceLearningV2 {
    const learning: IntelligenceLearningV2 = {
      id: `intelligence-learning-v2-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 10)}`,
      sourceId,
      lesson,
      score,
      metadata: { ...metadata },
      createdAt: new Date().toISOString(),
    };

    this.learnings.unshift(learning);
    return this.clone(learning);
  }

  list(): IntelligenceLearningV2[] {
    return this.learnings.map((learning) => this.clone(learning));
  }

  count(): number {
    return this.learnings.length;
  }

  private clone(learning: IntelligenceLearningV2): IntelligenceLearningV2 {
    return { ...learning, metadata: { ...learning.metadata } };
  }
}

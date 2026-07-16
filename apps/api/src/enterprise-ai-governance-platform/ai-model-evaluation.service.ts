import { Injectable } from "@nestjs/common";
import type { AiEvaluationRecord } from "./enterprise-ai-governance.types";

@Injectable()
export class AiModelEvaluationService {
  private readonly evaluations: AiEvaluationRecord[] = [];

  evaluate(
    input: Omit<AiEvaluationRecord, "id" | "passed" | "evaluatedAt">,
  ): AiEvaluationRecord {
    const passed =
      input.accuracy >= 0.7 &&
      input.safety >= 0.8 &&
      input.relevance >= 0.7 &&
      input.latencyMs <= 5000;

    const evaluation: AiEvaluationRecord = {
      ...input,
      notes: [...input.notes],
      id: `ai-eval-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      passed,
      evaluatedAt: new Date().toISOString(),
    };

    this.evaluations.unshift(evaluation);

    if (this.evaluations.length > 5000) {
      this.evaluations.length = 5000;
    }

    return this.clone(evaluation);
  }

  list(modelId?: string): AiEvaluationRecord[] {
    return this.evaluations
      .filter((evaluation) =>
        modelId ? evaluation.modelId === modelId : true,
      )
      .map((evaluation) => this.clone(evaluation));
  }

  count(): number {
    return this.evaluations.length;
  }

  failedCount(): number {
    return this.evaluations.filter((evaluation) => !evaluation.passed).length;
  }

  private clone(evaluation: AiEvaluationRecord): AiEvaluationRecord {
    return {
      ...evaluation,
      notes: [...evaluation.notes],
    };
  }
}

import { Injectable } from "@nestjs/common";

@Injectable()
export class ExplainabilityEngineService {
  explain(input: {
    readonly subjectId: string;
    readonly metrics: Readonly<Record<string, number>>;
  }) {
    const rationale = Object.entries(input.metrics).map(
      ([name, value]) => `${name}=${value}`,
    );

    return {
      subjectId: input.subjectId,
      score: rationale.length >= 4 ? 100 : 70,
      rationale,
      explainable: rationale.length >= 4,
    };
  }
}

import { Injectable } from "@nestjs/common";
import { LearningPolicy } from "../policies/learning.policy";
@Injectable()
export class LearningStoreService {
  private readonly records: Array<Record<string, unknown>> = [];
  constructor(private readonly policy: LearningPolicy) {}
  record(input: {
    source: string;
    input: Record<string, unknown>;
    output: Record<string, unknown>;
    score: number;
  }) {
    this.policy.validate(input.score);
    const record = {
      id: `learning_${Date.now()}`,
      ...input,
      createdAt: new Date().toISOString(),
    };
    this.records.push(record);
    return record;
  }
  list() { return [...this.records]; }
}

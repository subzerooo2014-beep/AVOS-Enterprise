import { Injectable } from "@nestjs/common";
import { ReviewPolicy } from "../policies/review.policy";
@Injectable()
export class ReviewService {
  private readonly records: Array<Record<string, unknown>> = [];
  constructor(private readonly policy: ReviewPolicy) {}
  create(input: { entityId: string; userId: string; score: number; comment?: string }) {
    this.policy.validate(input.score);
    const record = {
      id: `review_${Date.now()}`,
      ...input,
      createdAt: new Date().toISOString(),
    };
    this.records.push(record);
    return record;
  }
  list() { return [...this.records]; }
}

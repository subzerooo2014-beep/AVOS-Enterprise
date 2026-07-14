import { Injectable } from "@nestjs/common";

@Injectable()
export class FeedbackLearningEngine {
  private readonly feedback: Array<{ recommendationId: string; accepted: boolean; outcomeScore?: number }> = [];

  record(input: { recommendationId: string; accepted: boolean; outcomeScore?: number }) {
    this.feedback.push(input);
    return { stored: true, totalFeedback: this.feedback.length };
  }

  stats() {
    const accepted = this.feedback.filter((item) => item.accepted).length;
    return { total: this.feedback.length, accepted, acceptanceRate: this.feedback.length ? Math.round((accepted / this.feedback.length) * 100) : 0 };
  }
}

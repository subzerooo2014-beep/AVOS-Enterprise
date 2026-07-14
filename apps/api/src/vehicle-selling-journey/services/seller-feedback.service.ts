import { Injectable } from "@nestjs/common";
@Injectable()
export class SellerFeedbackService {
  private readonly feedback: Array<Record<string, unknown>> = [];
  record(input: Record<string, unknown>) {
    const item = { id: `feedback_${Date.now()}`, ...input };
    this.feedback.push(item);
    return item;
  }
  list() { return [...this.feedback]; }
}

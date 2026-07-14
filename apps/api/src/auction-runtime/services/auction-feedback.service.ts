import { Injectable } from "@nestjs/common";
@Injectable()
export class AuctionFeedbackService {
  private readonly items: Array<Record<string, unknown>> = [];
  record(input: Record<string, unknown>) {
    const item = { id: `feedback_${Date.now()}`, ...input };
    this.items.push(item);
    return item;
  }
  list() { return [...this.items]; }
}

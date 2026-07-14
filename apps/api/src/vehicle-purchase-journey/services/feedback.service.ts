import { Injectable } from "@nestjs/common";
@Injectable()
export class JourneyFeedbackService {
  private readonly items: any[] = [];
  record(input: { journeyId: string; rating: number; comment?: string }) {
    const item = { id: `feedback_${Date.now()}`, ...input };
    this.items.push(item);
    return item;
  }
  list() { return [...this.items]; }
}

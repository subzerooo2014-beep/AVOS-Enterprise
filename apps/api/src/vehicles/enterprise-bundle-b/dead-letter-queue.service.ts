import { Injectable } from "@nestjs/common";

@Injectable()
export class DeadLetterQueueService {
  private readonly records: Array<Record<string, unknown>> = [];

  add(record: Record<string, unknown>) {
    const item = {
      id: `dlq-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      createdAt: new Date().toISOString(),
      ...record,
    };

    this.records.push(item);
    return item;
  }

  list() {
    return [...this.records].reverse();
  }
}

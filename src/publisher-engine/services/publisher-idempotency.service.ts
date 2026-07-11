import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherIdempotencyService {
  private readonly executed = new Set<string>();

  executedBefore(id: string) {
    return this.executed.has(id);
  }

  mark(id: string) {
    this.executed.add(id);
  }

  clear() {
    this.executed.clear();
  }

  count() {
    return this.executed.size;
  }
}

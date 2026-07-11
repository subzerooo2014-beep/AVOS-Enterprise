import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherEngineTriggerHistoryService {

  private readonly history: any[] = [];

  push(item: any) {
    this.history.unshift(item);

    if (this.history.length > 5000) {
      this.history.length = 5000;
    }

    return item;
  }

  latest(limit = 100) {
    return this.history.slice(0, limit);
  }
}

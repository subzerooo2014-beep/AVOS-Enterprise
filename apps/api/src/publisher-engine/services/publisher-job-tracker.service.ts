import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherJobTrackerService {
  private readonly tracker = new Map<string, Date>();

  start(id: string) {
    this.tracker.set(id, new Date());
  }

  finish(id: string) {
    const start = this.tracker.get(id);
    this.tracker.delete(id);

    return start
      ? Date.now() - start.getTime()
      : 0;
  }
}

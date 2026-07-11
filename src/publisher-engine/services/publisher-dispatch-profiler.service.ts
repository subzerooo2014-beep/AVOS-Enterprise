import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherDispatchProfilerService {
  profile(start: Date) {
    return {
      startedAt: start,
      finishedAt: new Date(),
      executionMs: Date.now() - start.getTime(),
    };
  }
}

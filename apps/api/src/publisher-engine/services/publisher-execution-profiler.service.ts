import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherExecutionProfilerService {
  profile(start: Date, end = new Date()) {
    return {
      executionMs: end.getTime() - start.getTime(),
      startedAt: start,
      finishedAt: end,
    };
  }
}

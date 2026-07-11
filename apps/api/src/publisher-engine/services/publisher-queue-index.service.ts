import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherQueueIndexService {
  index(jobs: any[]) {
    const map: Record<string, any> = {};

    for (const job of jobs) {
      map[job.id] = job;
    }

    return map;
  }
}

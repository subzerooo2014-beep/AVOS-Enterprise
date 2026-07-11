import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherJobGroupService {
  byChannel(jobs: any[]) {
    const result: Record<string, any[]> = {};

    for (const job of jobs) {
      const channel =
        job?.result?.publisher?.channel ??
        job?.result?.channel ??
        "internal";

      result[channel] ??= [];
      result[channel].push(job);
    }

    return result;
  }
}

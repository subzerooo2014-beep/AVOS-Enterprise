import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherJobResultService {
  merge(job: any, result: any) {
    return {
      ...(job.result ?? {}),
      publisher: result,
      mergedAt: new Date().toISOString(),
    };
  }
}

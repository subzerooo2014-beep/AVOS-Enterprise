import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherJobMetadataService {
  merge(job: any, extra: any) {
    return {
      ...(job.result ?? {}),
      ...extra,
      updatedAt: new Date().toISOString(),
    };
  }
}

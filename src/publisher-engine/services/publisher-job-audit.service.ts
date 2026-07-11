import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherJobAuditService {
  record(action: string, jobId: string) {
    return {
      action,
      jobId,
      timestamp: new Date(),
    };
  }
}

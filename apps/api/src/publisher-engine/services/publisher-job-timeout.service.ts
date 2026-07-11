import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherJobTimeoutService {
  expired(job: any, minutes = 10) {
    if (!job?.lockedAt) return false;

    return (
      Date.now() -
        new Date(job.lockedAt).getTime() >
      minutes * 60 * 1000
    );
  }
}

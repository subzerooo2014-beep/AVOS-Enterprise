import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherJobLeaseService {
  lease(workerId: string, minutes = 10) {
    const now = new Date();

    return {
      workerId,
      lockedAt: now,
      expiresAt: new Date(now.getTime() + minutes * 60000),
    };
  }

  expired(expiresAt: Date) {
    return expiresAt.getTime() <= Date.now();
  }
}

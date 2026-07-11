import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherJobLockManagerService {
  lock(workerId: string) {
    return {
      workerId,
      lockedAt: new Date(),
      active: true,
    };
  }

  unlock() {
    return {
      active: false,
      unlockedAt: new Date(),
    };
  }
}

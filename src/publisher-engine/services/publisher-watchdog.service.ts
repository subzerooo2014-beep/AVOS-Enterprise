import { Injectable } from "@nestjs/common";
import { PublisherLockManagerService } from "./publisher-lock-manager.service";

@Injectable()
export class PublisherWatchdogService {
  constructor(
    private readonly lockManager: PublisherLockManagerService,
  ) {}

  async run() {
    const released = await this.lockManager.releaseExpired(10);

    return {
      success: true,
      released,
      checkedAt: new Date(),
    };
  }
}

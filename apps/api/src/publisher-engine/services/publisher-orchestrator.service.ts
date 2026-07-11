import { Injectable } from "@nestjs/common";
import { PublisherDispatcherService } from "../publisher-dispatcher.service";
import { PublisherWatchdogService } from "./publisher-watchdog.service";
import { PublisherSystemService } from "./publisher-system.service";

@Injectable()
export class PublisherOrchestratorService {
  constructor(
    private readonly dispatcher: PublisherDispatcherService,
    private readonly watchdog: PublisherWatchdogService,
    private readonly system: PublisherSystemService,
  ) {}

  async execute(limit = 20) {
    await this.watchdog.run();

    const dispatch = await this.dispatcher.dispatchQueued(limit);

    return {
      success: true,
      dispatch,
      system: await this.system.status(),
      finishedAt: new Date(),
    };
  }
}

import { Injectable } from "@nestjs/common";
import { PublisherDispatcherService } from "../publisher-dispatcher.service";

@Injectable()
export class PublisherSchedulerService {
  constructor(
    private readonly dispatcher: PublisherDispatcherService,
  ) {}

  async tick(limit = 20) {
    return this.dispatcher.dispatchQueued(limit);
  }
}

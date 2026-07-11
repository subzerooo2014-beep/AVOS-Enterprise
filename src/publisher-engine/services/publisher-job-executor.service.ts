import { Injectable } from "@nestjs/common";
import { PublisherDispatcherService } from "../publisher-dispatcher.service";

@Injectable()
export class PublisherJobExecutorService {
  constructor(
    private readonly dispatcher: PublisherDispatcherService,
  ) {}

  execute(limit = 20) {
    return this.dispatcher.dispatchQueued(limit);
  }

  executeOne(id: string) {
    return this.dispatcher.dispatchOne(id);
  }
}

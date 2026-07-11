import { Injectable } from "@nestjs/common";
import { PublisherDispatcherService } from "../publisher-dispatcher.service";

@Injectable()
export class PublisherBatchDispatchService {
  constructor(
    private readonly dispatcher: PublisherDispatcherService,
  ) {}

  async dispatch(limit = 100) {
    return this.dispatcher.dispatchQueued(limit);
  }
}

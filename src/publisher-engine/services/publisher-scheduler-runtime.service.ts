import { Injectable } from "@nestjs/common";
import { PublisherSchedulerService } from "./publisher-scheduler.service";

@Injectable()
export class PublisherSchedulerRuntimeService {
  constructor(
    private readonly scheduler: PublisherSchedulerService,
  ) {}

  async run(limit = 20) {
    return this.scheduler.tick(limit);
  }
}

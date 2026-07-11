import { Injectable } from "@nestjs/common";
import { PublisherBatchDispatchService } from "./publisher-batch-dispatch.service";

@Injectable()
export class PublisherBatchRuntimeService {
  constructor(
    private readonly batch: PublisherBatchDispatchService,
  ) {}

  execute(limit = 100) {
    return this.batch.dispatch(limit);
  }
}

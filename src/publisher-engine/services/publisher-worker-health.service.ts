import { Injectable } from "@nestjs/common";
import { PublisherWorkerPoolService } from "./publisher-worker-pool.service";

@Injectable()
export class PublisherWorkerHealthService {
  constructor(
    private readonly pool: PublisherWorkerPoolService,
  ) {}

  health() {
    return {
      success: true,
      workers: this.pool.list(),
      generatedAt: new Date(),
    };
  }
}

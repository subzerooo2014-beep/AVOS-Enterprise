import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherWorkerService {
  private readonly workerId = `worker_${process.pid}`;

  id() {
    return this.workerId;
  }

  heartbeat() {
    return {
      workerId: this.workerId,
      status: "alive",
      timestamp: new Date(),
    };
  }
}

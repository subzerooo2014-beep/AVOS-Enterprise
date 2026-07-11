import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherWorkerHeartbeatService {
  heartbeat(workerId: string) {
    return {
      workerId,
      heartbeatAt: new Date(),
      alive: true,
    };
  }
}

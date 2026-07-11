import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherEngineHeartbeatService {
  heartbeat() {
    return {
      alive: true,
      heartbeatAt: new Date(),
    };
  }
}

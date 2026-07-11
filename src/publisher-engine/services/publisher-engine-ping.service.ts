import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherEnginePingService {
  ping() {
    return {
      pong: true,
      timestamp: new Date(),
    };
  }
}

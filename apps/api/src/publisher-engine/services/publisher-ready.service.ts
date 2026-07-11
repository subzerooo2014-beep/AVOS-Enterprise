import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherReadyService {
  ready() {
    return {
      success: true,
      engine: "Publisher Engine V2",
      state: "READY",
      timestamp: new Date(),
    };
  }
}

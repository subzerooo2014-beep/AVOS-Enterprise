import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherEngineShutdownService {
  shutdown() {
    return {
      success: true,
      state: "STOPPED",
      stoppedAt: new Date(),
    };
  }
}

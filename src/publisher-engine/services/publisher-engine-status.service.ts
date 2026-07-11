import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherEngineStatusService {
  status() {
    return {
      engine: "PublisherEngineV2",
      version: "2.0.0",
      status: "healthy",
      timestamp: new Date(),
    };
  }
}

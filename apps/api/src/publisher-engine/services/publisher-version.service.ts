import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherVersionService {
  info() {
    return {
      engine: "Publisher Engine",
      version: "2.0.0",
      stage: "production",
      build: "MP3-P1",
      timestamp: new Date(),
    };
  }
}

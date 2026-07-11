import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherEngineBuildService {
  build() {
    return {
      engine: "Publisher Engine",
      version: "2.0.0",
      build: "MP3",
      generatedAt: new Date(),
    };
  }
}

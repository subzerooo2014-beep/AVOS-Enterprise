import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherEngineEnvironmentService {
  environment() {
    return {
      nodeEnv: process.env.NODE_ENV ?? "development",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      generatedAt: new Date(),
    };
  }
}

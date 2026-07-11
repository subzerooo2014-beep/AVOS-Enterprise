import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherEngineInfoService {
  info() {
    return {
      name: "Publisher Engine",
      version: "2.0.0",
      stage: "production",
      node: process.version,
    };
  }
}

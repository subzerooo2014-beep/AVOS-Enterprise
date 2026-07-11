import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherEngineInfoService {
  info() {
    return {
      engine: "AVOS Publisher Engine",
      version: "2.0.0",
      mode: "Production",
      build: "Mega Pack 3",
      ready: true,
      generatedAt: new Date(),
    };
  }
}

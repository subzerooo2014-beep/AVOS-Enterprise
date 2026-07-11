import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherEngineBannerService {
  banner() {
    return {
      engine: "AVOS Publisher Engine V2",
      mode: "Production",
      version: "2.0.0",
      generatedAt: new Date(),
    };
  }
}

import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherBannerService {
  banner() {
    return {
      engine: "AVOS Publisher Engine",
      version: "2.0.0",
      mode: "Production",
      ready: true,
      timestamp: new Date(),
    };
  }
}

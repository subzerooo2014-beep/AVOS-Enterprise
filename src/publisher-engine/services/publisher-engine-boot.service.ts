import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherEngineBootService {
  boot() {
    return {
      success: true,
      state: "BOOTED",
      startedAt: new Date(),
    };
  }
}

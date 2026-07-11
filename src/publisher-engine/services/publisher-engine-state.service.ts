import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherEngineStateService {
  state() {
    return {
      engine: "PublisherEngineV2",
      state: "RUNNING",
      startedAt: new Date(),
    };
  }
}

import { Injectable } from "@nestjs/common";
import { PublisherEngineProductionV3Service } from "./publisher-engine-production-v3.service";

@Injectable()
export class PublisherEngineFinishedService {

  constructor(
    private readonly production: PublisherEngineProductionV3Service,
  ) {}

  finish() {
    return {
      state: "FINISHED",
      production: this.production.production(),
      finishedAt: new Date(),
    };
  }
}

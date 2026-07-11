import { Injectable } from "@nestjs/common";
import { PublisherEnterpriseFinalService } from "./publisher-enterprise-final.service";
import { PublisherEngineProcessService } from "./publisher-engine-process.service";

@Injectable()
export class PublisherEngineProductionService {
  constructor(
    private readonly enterprise: PublisherEnterpriseFinalService,
    private readonly processInfo: PublisherEngineProcessService,
  ) {}

  production() {
    return {
      enterprise: this.enterprise.final(),
      process: this.processInfo.info(),
      generatedAt: new Date(),
    };
  }
}

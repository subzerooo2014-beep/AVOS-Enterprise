import { Injectable } from "@nestjs/common";
import { PublisherProductionService } from "./publisher-production.service";
import { PublisherSystemRuntimeService } from "./publisher-system-runtime.service";

@Injectable()
export class PublisherEnterpriseService {
  constructor(
    private readonly production: PublisherProductionService,
    private readonly runtime: PublisherSystemRuntimeService,
  ) {}

  async execute(limit = 20) {
    return {
      success: true,
      production: await this.production.execute(limit),
      runtime: this.runtime.info(),
      version: "Enterprise V2",
      generatedAt: new Date(),
    };
  }
}

import { Injectable } from "@nestjs/common";
import { PublisherEngineRuntimeV2Service } from "./publisher-engine-runtime-v2.service";
import { PublisherProductionService } from "./publisher-production.service";

@Injectable()
export class PublisherEnterpriseRuntimeService {
  constructor(
    private readonly runtime: PublisherEngineRuntimeV2Service,
    private readonly production: PublisherProductionService,
  ) {}

  async report(limit = 20) {
    return {
      runtime: await this.runtime.status(),
      production: await this.production.execute(limit),
      generatedAt: new Date(),
    };
  }
}

import { Injectable } from "@nestjs/common";
import { PublisherEngineEnterpriseReleaseService } from "./publisher-engine-enterprise-release.service";
import { PublisherEngineOrchestratorService } from "./publisher-engine-orchestrator.service";

@Injectable()
export class PublisherEngineRuntimeV3Service {

  constructor(
    private readonly release: PublisherEngineEnterpriseReleaseService,
    private readonly orchestrator: PublisherEngineOrchestratorService,
  ) {}

  runtime() {
    return {
      release: this.release.release(),
      orchestrator: "READY",
      generatedAt: new Date(),
    };
  }
}

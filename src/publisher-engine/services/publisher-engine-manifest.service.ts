import { Injectable } from "@nestjs/common";
import { PublisherEnginePackageService } from "./publisher-engine-package.service";
import { PublisherEngineCapabilityService } from "./publisher-engine-capability.service";

@Injectable()
export class PublisherEngineManifestService {
  constructor(
    private readonly pkg: PublisherEnginePackageService,
    private readonly capability: PublisherEngineCapabilityService,
  ) {}

  manifest() {
    return {
      package: this.pkg.package(),
      capabilities: this.capability.capabilities(),
      generatedAt: new Date(),
    };
  }
}

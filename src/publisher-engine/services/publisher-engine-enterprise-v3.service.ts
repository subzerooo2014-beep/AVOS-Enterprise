import { Injectable } from "@nestjs/common";
import { PublisherEngineRuntimeV3Service } from "./publisher-engine-runtime-v3.service";

@Injectable()
export class PublisherEngineEnterpriseV3Service {

  constructor(
    private readonly runtime: PublisherEngineRuntimeV3Service,
  ) {}

  report() {
    return {
      success: true,
      runtime: this.runtime.runtime(),
      generatedAt: new Date(),
    };
  }
}

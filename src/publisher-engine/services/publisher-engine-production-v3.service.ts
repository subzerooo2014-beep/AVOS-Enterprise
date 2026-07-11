import { Injectable } from "@nestjs/common";
import { PublisherEngineEnterpriseV3Service } from "./publisher-engine-enterprise-v3.service";

@Injectable()
export class PublisherEngineProductionV3Service {

  constructor(
    private readonly enterprise: PublisherEngineEnterpriseV3Service,
  ) {}

  production() {
    return {
      success: true,
      enterprise: this.enterprise.report(),
      generatedAt: new Date(),
    };
  }
}

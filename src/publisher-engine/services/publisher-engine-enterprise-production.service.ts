import { Injectable } from "@nestjs/common";
import { PublisherEngineEnterpriseMonitorService } from "./publisher-engine-enterprise-monitor.service";

@Injectable()
export class PublisherEngineEnterpriseProductionService {

  constructor(
    private readonly monitor: PublisherEngineEnterpriseMonitorService,
  ) {}

  production() {
    return {
      success: true,
      monitor: this.monitor.monitor(),
      generatedAt: new Date(),
    };
  }

}

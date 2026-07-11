import { Injectable } from "@nestjs/common";
import { PublisherEnterpriseRuntimeService } from "./publisher-enterprise-runtime.service";
import { PublisherEngineMonitorService } from "./publisher-engine-monitor.service";

@Injectable()
export class PublisherEnterpriseDashboardService {
  constructor(
    private readonly runtime: PublisherEnterpriseRuntimeService,
    private readonly monitor: PublisherEngineMonitorService,
  ) {}

  async dashboard() {
    return {
      success: true,
      runtime: await this.runtime.report(),
      monitor: this.monitor.monitor(),
      generatedAt: new Date(),
    };
  }
}

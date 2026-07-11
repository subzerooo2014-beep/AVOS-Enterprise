import { Injectable } from "@nestjs/common";
import { PublisherEnterpriseMonitorService } from "./publisher-enterprise-monitor.service";

@Injectable()
export class PublisherEnterpriseStatusService {
  constructor(
    private readonly monitor: PublisherEnterpriseMonitorService,
  ) {}

  async status() {
    return {
      success: true,
      system: await this.monitor.monitor(),
      edition: "Enterprise",
      version: "2.0.0",
      generatedAt: new Date(),
    };
  }
}

import { Injectable } from "@nestjs/common";
import { PublisherEnterpriseDashboardService } from "./publisher-enterprise-dashboard.service";
import { PublisherHealthReportService } from "./publisher-health-report.service";

@Injectable()
export class PublisherEnterpriseMonitorService {
  constructor(
    private readonly dashboard: PublisherEnterpriseDashboardService,
    private readonly health: PublisherHealthReportService,
  ) {}

  async monitor() {
    return {
      success: true,
      dashboard: await this.dashboard.dashboard(),
      health: this.health.report(),
      generatedAt: new Date(),
    };
  }
}

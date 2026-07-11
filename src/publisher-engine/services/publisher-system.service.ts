import { Injectable } from "@nestjs/common";
import { PublisherDashboardV2Service } from "./publisher-dashboard-v2.service";
import { PublisherHealthMonitorService } from "./publisher-health-monitor.service";

@Injectable()
export class PublisherSystemService {
  constructor(
    private readonly dashboard: PublisherDashboardV2Service,
    private readonly health: PublisherHealthMonitorService,
  ) {}

  async status() {
    return {
      success: true,
      engine: "Publisher Engine V2",
      version: "2.0.0",
      health: await this.health.status(),
      dashboard: await this.dashboard.dashboard(),
      generatedAt: new Date(),
    };
  }
}

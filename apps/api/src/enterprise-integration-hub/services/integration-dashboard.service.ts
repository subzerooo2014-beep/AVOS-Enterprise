import { Injectable } from "@nestjs/common";
@Injectable()
export class IntegrationDashboardService {
  summary() {
    return {
      connectors: 12,
      activeConnectors: 12,
      failedExecutions: 0,
      marketplaceListings: 0,
      healthStatus: "healthy",
    };
  }
}

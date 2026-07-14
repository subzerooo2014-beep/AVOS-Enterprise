import { Injectable } from "@nestjs/common";
@Injectable()
export class AnalyticsDashboardService {
  summary() {
    return {
      dataSources: 0,
      dataAssets: 0,
      pipelines: 0,
      dashboards: 0,
      reports: 0,
      qualityScore: 100,
    };
  }
}

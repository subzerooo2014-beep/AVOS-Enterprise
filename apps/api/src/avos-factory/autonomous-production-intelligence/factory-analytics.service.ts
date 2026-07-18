import { Injectable } from "@nestjs/common";
import {
  FactoryAnalytics,
  FactoryResourceSnapshot,
  FactoryWorkItem,
} from "./factory-intelligence.contracts";

@Injectable()
export class FactoryAnalyticsService {
  calculate(
    items: FactoryWorkItem[],
    resources: FactoryResourceSnapshot,
  ): FactoryAnalytics {
    const completed = items.filter((item) => item.status === "completed");
    const failed = items.filter((item) => item.status === "failed");
    const active = items.filter((item) => item.status === "running");
    const quality =
      completed.length === 0
        ? 0
        : Math.round(
            completed.reduce((sum, item) => sum + item.qualityScore, 0) /
              completed.length,
          );

    const retries = items.reduce((sum, item) => sum + item.retryCount, 0);
    const retryRate =
      items.length === 0 ? 0 : Math.round((retries / items.length) * 100);

    return {
      queueDepth: resources.queueDepth,
      activeJobs: active.length,
      completedJobs: completed.length,
      failedJobs: failed.length,
      averageQualityScore: quality,
      utilizationPercent: Math.round(
        (resources.allocatedUnits / resources.totalUnits) * 100,
      ),
      throughputPerHour: completed.length,
      retryRatePercent: retryRate,
    };
  }
}

import { Injectable } from "@nestjs/common";
import { DataQualityService } from "./data-quality.service";
import { EtlRuntimeService } from "./etl-runtime.service";
import { EventAnalyticsService } from "./event-analytics.service";
import { TimeSeriesStoreService } from "./time-series-store.service";

@Injectable()
export class AnalyticsEngineService {
  constructor(
    private readonly quality: DataQualityService,
    private readonly etl: EtlRuntimeService,
    private readonly events: EventAnalyticsService,
    private readonly timeSeries: TimeSeriesStoreService,
  ) {}

  snapshot() {
    return {
      quality: {
        checks: this.quality.resultCount(),
        failures: this.quality.failureCount(),
      },
      etl: {
        executions: this.etl.executionCount(),
        failures: this.etl.failedExecutionCount(),
      },
      events: this.events.summary(),
      timeSeriesPoints: this.timeSeries.count(),
      generatedAt: new Date().toISOString(),
    };
  }
}

import { Injectable } from "@nestjs/common";
import { ProviderMetricsService } from "./provider-metrics.service";

@Injectable()
export class SlaMonitorService {
  constructor(private readonly metrics: ProviderMetricsService) {}
  report() { return { generatedAt: new Date().toISOString(), providers: this.metrics.summary() }; }
}

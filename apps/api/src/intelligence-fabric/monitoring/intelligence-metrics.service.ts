import { Injectable } from "@nestjs/common";
import { IntelligenceRuntimeService } from "../runtime/intelligence-runtime.service";
import { IntelligenceSignalRegistryService } from "../signals/intelligence-signal-registry.service";

@Injectable()
export class IntelligenceMetricsService {
  private readonly startedAt = Date.now();

  constructor(
    private readonly runtime: IntelligenceRuntimeService,
    private readonly signals: IntelligenceSignalRegistryService,
  ) {}

  snapshot(): Record<string, unknown> {
    const runtime = this.runtime.snapshot();
    const total = runtime.completedAnalyses + runtime.failedAnalyses;

    return {
      timestamp: new Date().toISOString(),
      uptimeMs: Date.now() - this.startedAt,
      runtime,
      registeredSignals: this.signals.count(),
      successRate:
        total === 0
          ? 100
          : Number(
              ((runtime.completedAnalyses / total) * 100).toFixed(2),
            ),
    };
  }
}
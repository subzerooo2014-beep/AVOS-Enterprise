import { Injectable } from "@nestjs/common";
import { PublisherEngineFinalizerService } from "./publisher-engine-finalizer.service";
import { PublisherRuntimeMonitorService } from "./publisher-runtime-monitor.service";

@Injectable()
export class PublisherProductionReportService {
  constructor(
    private readonly finalizer: PublisherEngineFinalizerService,
    private readonly runtime: PublisherRuntimeMonitorService,
  ) {}

  async report() {
    return {
      success: true,
      finalizer: await this.finalizer.finalize(),
      runtime: this.runtime.status(),
      generatedAt: new Date(),
    };
  }
}

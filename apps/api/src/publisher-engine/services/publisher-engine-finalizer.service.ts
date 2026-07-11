import { Injectable } from "@nestjs/common";
import { PublisherEngineProfilerService } from "./publisher-engine-profiler.service";
import { PublisherEngineSummaryService } from "./publisher-engine-summary.service";

@Injectable()
export class PublisherEngineFinalizerService {
  constructor(
    private readonly profiler: PublisherEngineProfilerService,
    private readonly summary: PublisherEngineSummaryService,
  ) {}

  async finalize() {
    return {
      success: true,
      summary: await this.summary.summary(),
      profiler: this.profiler.profile(),
      completedAt: new Date(),
    };
  }
}

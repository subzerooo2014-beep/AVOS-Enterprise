import { Injectable } from "@nestjs/common";
import { PublisherRuntimeStatService } from "./publisher-runtime-stat.service";
import { PublisherMemoryStatService } from "./publisher-memory-stat.service";

@Injectable()
export class PublisherHealthReportService {
  constructor(
    private readonly runtime: PublisherRuntimeStatService,
    private readonly memory: PublisherMemoryStatService,
  ) {}

  report() {
    return {
      success: true,
      runtime: this.runtime.stats(),
      memory: this.memory.usage(),
      generatedAt: new Date(),
    };
  }
}

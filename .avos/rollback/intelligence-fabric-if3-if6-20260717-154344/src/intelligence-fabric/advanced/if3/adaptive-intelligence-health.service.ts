import { Injectable } from "@nestjs/common";
import { AdaptiveLearningMemoryService } from "./adaptive-learning-memory.service";

@Injectable()
export class AdaptiveIntelligenceHealthService {
  constructor(private readonly learning: AdaptiveLearningMemoryService) {}

  snapshot(): Record<string, unknown> {
    const profiles = this.learning.profiles();

    return {
      status: "healthy",
      signals: this.learning.count(),
      profiles: profiles.length,
      averageAdaptiveWeight:
        profiles.length === 0
          ? 1
          : Number(
              (
                profiles.reduce((sum, item) => sum + item.adaptiveWeight, 0) /
                profiles.length
              ).toFixed(4),
            ),
      checkedAt: new Date().toISOString(),
    };
  }
}
import { Injectable } from "@nestjs/common";

@Injectable()
export class ContextMemoryEngineService {
  remember(input: {
    eventWeight: number;
    recencyScore: number;
    relevanceScore: number;
    confidenceScore: number;
  }) {
    const memoryScore = Math.round(
      input.eventWeight * 0.3 +
        input.recencyScore * 0.25 +
        input.relevanceScore * 0.3 +
        input.confidenceScore * 0.15,
    );

    return {
      memoryScore,
      retain: memoryScore >= 60,
    };
  }
}

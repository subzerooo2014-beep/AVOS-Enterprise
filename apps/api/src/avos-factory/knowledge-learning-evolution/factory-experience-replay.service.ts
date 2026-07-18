import { Injectable } from "@nestjs/common";
import { ProductionMemoryService } from "./production-memory.service";

@Injectable()
export class FactoryExperienceReplayService {
  constructor(private readonly memory: ProductionMemoryService) {}

  replay(workItemId: string) {
    const timeline = this.memory.byWorkItem(workItemId);

    return {
      workItemId,
      events: timeline.length,
      timeline,
      lessons: timeline.map((entry) => ({
        stage: entry.stage,
        lesson:
          entry.outcome === "success"
            ? `Reuse successful execution strategy for ${entry.stage}.`
            : `Review failure evidence and recovery plan for ${entry.stage}.`,
      })),
      replayedAt: new Date().toISOString(),
    };
  }
}

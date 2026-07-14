import { Injectable } from "@nestjs/common";

@Injectable()
export class LanguageMemoryDashboardService {
  summary() {
    return {
      dialectProfiles: 0,
      voiceProfiles: 0,
      culturalProfiles: 0,
      memories: 0,
      sharedMemories: 0,
      replayOperations: 0,
      healthStatus: "healthy",
    };
  }
}

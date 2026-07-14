import { Injectable } from "@nestjs/common";
import { JourneyRepositoryService } from "./journey-repository.service";
@Injectable()
export class JourneyDashboardService {
  constructor(private readonly repo: JourneyRepositoryService) {}
  summary() {
    const journeys = this.repo.list();
    return {
      total: journeys.length,
      completed: journeys.filter(j => j.stage === "COMPLETED").length,
      cancelled: journeys.filter(j => j.stage === "CANCELLED").length,
      byStage: journeys.reduce<Record<string, number>>((acc, j) => {
        acc[j.stage] = (acc[j.stage] ?? 0) + 1;
        return acc;
      }, {}),
    };
  }
}

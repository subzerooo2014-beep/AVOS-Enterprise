import { Injectable } from "@nestjs/common";

@Injectable()
export class VehiclePriorityQueueService {
  prioritize(input: {
    urgency: number;
    valueScore: number;
    riskScore: number;
  }) {
    const priorityScore = Math.round(
      input.urgency * 0.35 +
      input.valueScore * 0.35 +
      input.riskScore * 0.3,
    );

    return {
      priorityScore,
      queue:
        priorityScore >= 80
          ? "CRITICAL"
          : priorityScore >= 60
            ? "PRIORITY"
            : "STANDARD",
    };
  }
}

import { Injectable } from "@nestjs/common";
@Injectable()
export class AiMetricsService {
  calculate(input: { total: number; completed: number; failed: number; averageLatencyMs: number }) {
    return {
      successRate: input.total ? Math.round((input.completed / input.total) * 100) : 0,
      failureRate: input.total ? Math.round((input.failed / input.total) * 100) : 0,
      averageLatencyMs: input.averageLatencyMs,
    };
  }
}

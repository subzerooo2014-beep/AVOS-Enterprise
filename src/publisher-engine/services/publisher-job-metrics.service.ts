import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherJobMetricsService {
  create(durationMs: number, status: string) {
    return {
      status,
      durationMs,
      createdAt: new Date(),
    };
  }
}

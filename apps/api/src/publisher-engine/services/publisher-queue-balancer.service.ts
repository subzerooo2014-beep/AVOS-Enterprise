import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherQueueBalancerService {
  balance(jobs: any[]) {
    return [...jobs].sort((a, b) => {
      const pa = String(a.priority ?? "normal");
      const pb = String(b.priority ?? "normal");

      if (pa === pb) {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }

      const weight: Record<string, number> = {
        urgent: 1,
        high: 2,
        normal: 3,
        low: 4,
      };

      return (weight[pa] ?? 3) - (weight[pb] ?? 3);
    });
  }
}

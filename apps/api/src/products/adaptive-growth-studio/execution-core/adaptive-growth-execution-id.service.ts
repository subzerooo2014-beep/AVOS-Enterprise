import { Injectable } from "@nestjs/common";

@Injectable()
export class AdaptiveGrowthExecutionIdService {
  create(prefix: string): string {
    const entropy = Math.random()
      .toString(36)
      .slice(2, 10);

    return `${prefix}:${Date.now()}:${entropy}`;
  }
}
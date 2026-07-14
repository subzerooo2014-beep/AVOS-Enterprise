import { Injectable } from "@nestjs/common";
@Injectable()
export class GovernmentRateLimitService {
  private readonly usage = new Map<string, number>();
  allow(provider: string, limit = 60) {
    const count = (this.usage.get(provider) ?? 0) + 1;
    this.usage.set(provider, count);
    return count <= limit;
  }
}

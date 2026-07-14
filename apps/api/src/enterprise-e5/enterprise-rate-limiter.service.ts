import { Injectable } from "@nestjs/common";

@Injectable()
export class EnterpriseRateLimiterService {
  private readonly windows = new Map<
    string,
    { count: number; startedAt: number }
  >();

  allow(key: string, limit = 100, windowMs = 60_000) {
    const now = Date.now();
    const current = this.windows.get(key);

    if (!current || now - current.startedAt >= windowMs) {
      this.windows.set(key, { count: 1, startedAt: now });
      return {
        allowed: true,
        remaining: Math.max(0, limit - 1),
        resetAt: new Date(now + windowMs).toISOString(),
      };
    }

    current.count += 1;

    return {
      allowed: current.count <= limit,
      remaining: Math.max(0, limit - current.count),
      resetAt: new Date(current.startedAt + windowMs).toISOString(),
    };
  }
}
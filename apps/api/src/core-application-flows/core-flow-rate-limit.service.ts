import { HttpException, HttpStatus, Injectable } from "@nestjs/common";

@Injectable()
export class CoreFlowRateLimitService {
  private readonly windows = new Map<string, { count: number; resetAt: number }>();

  consume(key: string, limit = 100, windowMs = 60_000) {
    const now = Date.now();
    const current = this.windows.get(key);

    if (!current || current.resetAt <= now) {
      const next = { count: 1, resetAt: now + windowMs };
      this.windows.set(key, next);
      return { allowed: true, remaining: limit - 1, resetAt: next.resetAt };
    }

    if (current.count >= limit) {
      throw new HttpException(
        "Core flow rate limit exceeded.",
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    current.count += 1;
    return {
      allowed: true,
      remaining: Math.max(limit - current.count, 0),
      resetAt: current.resetAt,
    };
  }

  stats() {
    return {
      activeWindows: this.windows.size,
      generatedAt: new Date().toISOString(),
    };
  }
}

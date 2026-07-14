import { Injectable } from "@nestjs/common";

@Injectable()
export class RateLimiterService {
  private readonly windows = new Map<string, { count: number; resetAt: number }>();

  allow(code: string, limit = 60) {
    const now = Date.now();
    let window = this.windows.get(code);
    if (!window || window.resetAt <= now) window = { count: 0, resetAt: now + 60000 };
    window.count += 1;
    this.windows.set(code, window);
    return window.count <= limit;
  }
}

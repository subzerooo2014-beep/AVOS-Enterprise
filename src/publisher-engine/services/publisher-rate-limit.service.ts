import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherRateLimitService {
  private readonly requests = new Map<string, number>();

  allow(channel: string, limit = 100) {
    const current = this.requests.get(channel) ?? 0;

    if (current >= limit) {
      return false;
    }

    this.requests.set(channel, current + 1);

    return true;
  }

  reset(channel?: string) {
    if (channel) {
      this.requests.delete(channel);
      return;
    }

    this.requests.clear();
  }

  usage() {
    return Object.fromEntries(this.requests.entries());
  }
}

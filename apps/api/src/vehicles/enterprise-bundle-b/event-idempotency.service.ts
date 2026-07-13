import { Injectable } from "@nestjs/common";

@Injectable()
export class EventIdempotencyService {
  private readonly keys = new Set<string>();

  claim(key: string) {
    if (this.keys.has(key)) {
      return { accepted: false, duplicate: true };
    }

    this.keys.add(key);
    return { accepted: true, duplicate: false };
  }
}

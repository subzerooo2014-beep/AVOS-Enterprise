import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherJobDeduplicationService {
  private readonly keys = new Set<string>();

  exists(key: string) {
    return this.keys.has(key);
  }

  register(key: string) {
    this.keys.add(key);
  }

  remove(key: string) {
    this.keys.delete(key);
  }

  clear() {
    this.keys.clear();
  }
}

import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherWorkerRegistryService {
  private readonly workers = new Map<string, Date>();

  register(id: string) {
    this.workers.set(id, new Date());
  }

  touch(id: string) {
    this.workers.set(id, new Date());
  }

  remove(id: string) {
    this.workers.delete(id);
  }

  all() {
    return [...this.workers.entries()].map(([id, lastSeen]) => ({
      id,
      lastSeen,
    }));
  }
}

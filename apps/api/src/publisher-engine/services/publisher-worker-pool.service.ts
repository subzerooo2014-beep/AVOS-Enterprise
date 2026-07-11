import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherWorkerPoolService {
  private readonly workers = new Map<string, Date>();

  register(id: string) {
    this.workers.set(id, new Date());
  }

  heartbeat(id: string) {
    this.workers.set(id, new Date());
  }

  unregister(id: string) {
    this.workers.delete(id);
  }

  list() {
    return [...this.workers.entries()].map(([id,lastSeen])=>({
      id,
      lastSeen,
    }));
  }
}

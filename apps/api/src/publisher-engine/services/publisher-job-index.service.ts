import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherJobIndexService {
  private readonly index = new Map<string, any>();

  put(job: any) {
    this.index.set(job.id, job);
  }

  get(id: string) {
    return this.index.get(id);
  }

  has(id: string) {
    return this.index.has(id);
  }

  remove(id: string) {
    this.index.delete(id);
  }

  count() {
    return this.index.size;
  }

  values() {
    return [...this.index.values()];
  }
}

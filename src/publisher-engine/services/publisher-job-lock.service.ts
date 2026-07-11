import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherJobLockService {
  private readonly locks = new Set<string>();

  lock(id: string) {
    if (this.locks.has(id)) return false;
    this.locks.add(id);
    return true;
  }

  unlock(id: string) {
    this.locks.delete(id);
  }

  locked(id: string) {
    return this.locks.has(id);
  }
}

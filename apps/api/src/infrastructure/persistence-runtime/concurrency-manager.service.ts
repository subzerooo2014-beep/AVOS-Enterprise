import { ConflictException, Injectable } from "@nestjs/common";

@Injectable()
export class ConcurrencyManagerService {
  private readonly locks = new Set<string>();

  acquire(key: string): void {
    if (this.locks.has(key)) {
      throw new ConflictException(`Persistence lock '${key}' is already held.`);
    }

    this.locks.add(key);
  }

  release(key: string): void {
    this.locks.delete(key);
  }

  async runExclusive<T>(key: string, handler: () => Promise<T>): Promise<T> {
    this.acquire(key);

    try {
      return await handler();
    } finally {
      this.release(key);
    }
  }

  activeLocks(): string[] {
    return Array.from(this.locks.values()).sort();
  }
}

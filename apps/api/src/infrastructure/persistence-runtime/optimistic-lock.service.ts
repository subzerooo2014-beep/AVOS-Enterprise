import { ConflictException, Injectable } from "@nestjs/common";

@Injectable()
export class OptimisticLockService {
  private readonly versions = new Map<string, number>();

  current(key: string): number {
    return this.versions.get(key) ?? 0;
  }

  initialize(key: string, version = 0): number {
    if (!this.versions.has(key)) {
      this.versions.set(key, version);
    }

    return this.current(key);
  }

  assertAndIncrement(key: string, expectedVersion: number): number {
    const currentVersion = this.current(key);

    if (currentVersion !== expectedVersion) {
      throw new ConflictException(
        `Optimistic lock conflict for '${key}'. Expected ${expectedVersion}, current ${currentVersion}.`,
      );
    }

    const nextVersion = currentVersion + 1;
    this.versions.set(key, nextVersion);
    return nextVersion;
  }

  snapshot() {
    return Array.from(this.versions.entries()).map(([key, version]) => ({
      key,
      version,
    }));
  }
}

import { Injectable } from "@nestjs/common";

@Injectable()
export class SuperAppV5IdempotencyService {
  private readonly keys = new Map<string, string>();

  reserve(key: string, entityId: string): {
    accepted: boolean;
    existingEntityId?: string;
  } {
    const existing = this.keys.get(key);
    if (existing) {
      return {
        accepted: false,
        existingEntityId: existing,
      };
    }

    this.keys.set(key, entityId);
    return { accepted: true };
  }

  find(key: string): string | undefined {
    return this.keys.get(key);
  }

  size(): number {
    return this.keys.size;
  }
}

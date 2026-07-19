import { Injectable } from "@nestjs/common";

@Injectable()
export class StateStoreService {
  private readonly stores = new Map<string, Map<string, unknown>>();

  set(executionId: string, key: string, value: unknown): void {
    const store = this.stores.get(executionId) ?? new Map<string, unknown>();
    store.set(key, value);
    this.stores.set(executionId, store);
  }

  get<T = unknown>(executionId: string, key: string): T | undefined {
    return this.stores.get(executionId)?.get(key) as T | undefined;
  }

  snapshot(executionId: string): Record<string, unknown> {
    const store = this.stores.get(executionId);
    return store ? Object.fromEntries(store.entries()) : {};
  }

  clear(executionId: string): boolean {
    return this.stores.delete(executionId);
  }
}

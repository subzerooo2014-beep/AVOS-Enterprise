import { Injectable } from "@nestjs/common";

@Injectable()
export class EnterpriseDigitalMemoryVaultService {
  private readonly memory = new Map<string, string>();

  store(namespace: string, key: string, value: string) {
    this.memory.set(`${namespace}:${key}`, value);
    return { namespace, key, stored: true, storedAt: new Date().toISOString() };
  }

  read(namespace: string, key: string): string | null {
    return this.memory.get(`${namespace}:${key}`) || null;
  }

  count(): number {
    return this.memory.size;
  }
}
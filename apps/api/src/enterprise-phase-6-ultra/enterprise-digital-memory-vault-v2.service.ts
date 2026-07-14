import { Injectable } from "@nestjs/common";

@Injectable()
export class EnterpriseDigitalMemoryVaultV2Service {
  private readonly vault = new Map<string, string>();

  preserve(key: string, value: string) {
    this.vault.set(key, value);
    return {
      key,
      preserved: true,
      entries: this.vault.size,
      preservedAt: new Date().toISOString(),
    };
  }

  count(): number {
    return this.vault.size;
  }
}
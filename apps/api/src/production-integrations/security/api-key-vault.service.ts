import { Injectable } from "@nestjs/common";

@Injectable()
export class ApiKeyVaultService {
  private readonly keys = new Map<string, string>();

  set(providerCode: string, key: string) { this.keys.set(providerCode, key); }
  get(providerCode: string) { return this.keys.get(providerCode) ?? "sandbox-key"; }
  mask(providerCode: string) {
    const key = this.get(providerCode);
    return key.length <= 4 ? "****" : `${"*".repeat(key.length - 4)}${key.slice(-4)}`;
  }
}

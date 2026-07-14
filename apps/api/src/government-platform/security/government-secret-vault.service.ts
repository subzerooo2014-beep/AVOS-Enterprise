import { Injectable } from "@nestjs/common";
@Injectable()
export class GovernmentSecretVaultService {
  private readonly secrets = new Map<string, string>();
  set(key: string, value: string) { this.secrets.set(key, value); }
  get(key: string) { return this.secrets.get(key) ?? "sandbox-secret"; }
  mask(key: string) {
    const value = this.get(key);
    return value.length <= 4 ? "****" : `${"*".repeat(value.length - 4)}${value.slice(-4)}`;
  }
}

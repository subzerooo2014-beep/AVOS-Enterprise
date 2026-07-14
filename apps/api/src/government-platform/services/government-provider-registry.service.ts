import { Injectable } from "@nestjs/common";
@Injectable()
export class GovernmentProviderRegistryService {
  private readonly configs = [
    { provider: "UAE_PASS", environment: "SANDBOX", enabled: true },
    { provider: "EMIRATES_ID", environment: "SANDBOX", enabled: true },
    { provider: "RTA", environment: "SANDBOX", enabled: true },
    { provider: "MOI", environment: "SANDBOX", enabled: true },
    { provider: "SALIK", environment: "SANDBOX", enabled: true },
    { provider: "EVG", environment: "SANDBOX", enabled: true },
    { provider: "CUSTOMS", environment: "SANDBOX", enabled: true },
    { provider: "OWNERSHIP_TRANSFER", environment: "SANDBOX", enabled: true },
  ];
  list() { return [...this.configs]; }
}

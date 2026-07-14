import { Injectable } from "@nestjs/common";
import { ProviderKind } from "../production-integrations.types";
import { ProviderRegistryService } from "../core/provider-registry.service";
import { CircuitBreakerService } from "./circuit-breaker.service";

@Injectable()
export class FailoverRouterService {
  constructor(
    private readonly registry: ProviderRegistryService,
    private readonly breaker: CircuitBreakerService,
  ) {}

  select(kind: ProviderKind) {
    const provider = this.registry.byKind(kind).find((p) => this.breaker.canExecute(p.code));
    if (!provider) throw new Error(`No available provider for ${kind}`);
    return provider;
  }
}
